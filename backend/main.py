from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user_schema import UserSchema
from schemas.mail_schema import MailSchema
from schemas.feedback_schema import Feedback
from schemas.verify_otp import VerifyOtp
from schemas.set_new_password import SetNewPasswordSchema
from sql.models.user_model import User
from sql.models.file_model import UploadedFile
from sql.models.report_model import ReportDetails
from sql.models.chats_model import Chats
from db.db_connection import create_db_connection
from auth.hash_password import hash_password, verify_password
from auth.jwt_token import create_token, get_current_user
from rag.extractor.extract_text import extract_text
from rag.chunks.generate_chunks import create_chunks
from rag.vector.vector_store import create_or_get_vector_db
from rag.chat.chatbot import extract_report_values, generate_summary, answer_user_query
from cache.redis_client import redis_connection
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from services.email_service import send_mail
from services.otp_generation import generate_otp, otp_key
from cache.redis_client import redis_connection
from datetime import date

# app initialise
app = FastAPI()

# redis client connection
redis = redis_connection()

# allowed origins
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# checks whether new or older user & then register's user
@app.post("/signup")
async def create_user(user: UserSchema, db: AsyncSession = Depends(create_db_connection)):
    user_email = user.email
    user_password = user.password
  
    try:
        old_user = db.query(User).filter(
            User.email == user_email.email).first()

        if old_user is None:
            new_user = User(email=user_email.email,
                            password=hash_password(user_password))
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)

            return {"message": "registered successfully !"}

        else:
            return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user already exist !")

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="registration failed !")


# checks credentials & login's user
@app.post("/signin")
def login(user: UserSchema, db: AsyncSession = Depends(create_db_connection)):
    user_email = user.email
    user_password = user.password

    try:
        is_user = db.query(User).filter(User.email == user_email).first()

        if is_user is None or not verify_password(user_password, is_user.password):
            return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="invalid credentials !")

        token = create_token({"sub": is_user.email})

        return {"message": "login successfully !", "access_token": token}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="login failed !")


# process the doument & create embeddings and store it in a vector db
@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...), current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    file_name = file.filename
    path = f"upload/{file_name}"

    try:
        if not file_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="file not found !")
        is_old_doc = db.query(UploadedFile).filter(UploadedFile.user_id == current_user.id,
                                                   UploadedFile.file_name == file_name).first()
        if is_old_doc is not None:
            with open(path, "wb") as buffer:
                buffer.write(await file.read())

            new_doc = UploadedFile(user_id=current_user.id, file_name=file_name,
                                   file_path=path, upload_date=date.today())
            db.add(new_doc)
            await db.commit()
            await db.refresh()
        else:
            return {"message": "embeddings already exist !"}

        report_text = extract_text(file_name)
        response = extract_report_values(report_text)
        if response is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="failed to extract report values !")

        new_report = ReportDetails(hemoglobin=response.hemoglobin,
                                   wbc_count=response.wbc_count,
                                   platelet_count=response.platelet_count,
                                   blood_sugar=response.blood_sugar,
                                   hba1c=response.hba1c,
                                   total_cholesterol=response.total_cholesterol,
                                   hdl_cholesterol=response.hdl_cholesterol,
                                   ldl_cholesterol=response.ldl_cholesterol,
                                   triglycerides=response.triglycerides,
                                   creatinine=response.creatinine,
                                   egfr=response.egfr,
                                   ast_sgot=response.ast_sgot,
                                   alt_sgpt=response.alt_sgpt,
                                   tsh=response.tsh,
                                   vitamin_d=response.vitamin_d)

        report_dict = new_report.model_dump()
        summary = generate_summary(report_dict)
        if summary is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="failed to generate summary !")

        new_report.extracted_text = report_text
        new_report.summary_text = summary

        db.add(new_report)
        await db.commit()
        await db.refresh(new_report)

        documents = create_chunks(report_text)
        chunks_ids = []

        for i, doc in enumerate(documents):
            doc.meta["source"] = file_name
            doc.meta["user_id"] = current_user.id
            doc.meta["file_id"] = new_doc.id
            chunks_ids.append(f"{file_name}_{i}")

        vector_db = create_or_get_vector_db()
        vector_db.add_documents(documents, ids=chunks_ids)

        return {"message": "summary & embeddings generated successfully !",
                "file_id": new_doc.id, "summary": summary}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to upload report file !")


# processes user query & gives answer
@app.websocket("/chat")
async def chat(websocket: WebSocket, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id
    chat_history = [SystemMessage(content="You are a helpful assistant.")]

    await websocket.accept()
    try:
        while True:
            user_data = await websocket.receive_text()
            if not file_id:
                file_id = user_data["file_id"]

            user_message = user_data["message"]
            chat_history.append(HumanMessage(content=user_message))
            ai_response = answer_user_query(
                user_id, file_id, user_message, chat_history)

            if ai_response is None:
                await websocket.send_text("sorry server is busy !")

            else:
                chat_history.append(AIMessage(content=ai_response))
                await websocket.send_text(ai_response)

                new_message = Chats(user_id=user_id,
                                    user_msg=user_message, ai_msg=ai_response)
                db.add(new_message)
                await db.commit()
                await db.refresh(new_message)

    except WebSocketDisconnect:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="user disconnected ! !")


# deletes specific chat history
@app.delete("/delete-chat/{id}")
async def delete_chat(id: int, db: AsyncSession = Depends(create_db_connection)):
    try:
        file = db.query(UploadedFile).filter(UploadedFile.id == id).first()
        await db.delete(file)
        await db.commit()
        return {"message": "file deleted successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to delete chat history !")


# deletes user account & its history
@app.delete("/delete")
async def delete_profile(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id
    try:
        user = db.query(User).filter(User.id == user_id).first()
        await db.delete(user)
        await db.commit()
        return {"message": "profile deleted successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to delete chat history !")


# updates user account details
@app.put("/update-profile")
async def update_profile(user: UserSchema, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id
    try:
        is_user = db.query(User).filter(User.id == user_id).first()
        if not is_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="profile not found !")
        else:
            is_user.name = user.name
            is_user.email = user.email
            await db.commit()
            await db.refresh(is_user)
            return {"message": "profile deleted successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to delete chat history !")


# sends reset password mail
@app.post("/reset-password")
async def reset_password(email: MailSchema, db: AsyncSession = Depends(create_db_connection)):
    recipient_email = email.recipient_email
    try:
        is_user = db.query(User).filter(User.email == recipient_email).first()
        if not is_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="profile not found !")
        else:
            otp = generate_otp()
            redis = redis_connection()
            redis.set(otp_key(recipient_email), otp, ex=60)
            email_sub = "Reset Your Password"
            email_body = f"""
            Hello,

            We received a request to reset your password.

            Use the One-Time Password (OTP) below to reset your password:

            OTP: {otp}

            This OTP is valid for 10 minutes. If you did not request a password reset, you can safely ignore this email.
            Your account will remain secure.

            Thank you,
            Tech Team
            """
            await send_mail(email_sub, recipient_email, email_body)

            return {"message": "reset password mail sended successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to send reset email !")


# verify otp
@app.post("/verify-otp")
async def verify_otp(data: VerifyOtp):
    user_email = data.email
    user_entered_otp = data.otp
    try:
        redis = redis_connection()
        is_otp = int(redis.get(otp_key(user_email)))
        if not is_otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="otp not found !")

        elif user_entered_otp == is_otp:
            redis.delete(otp_key(user_email))

        return {"message": "otp verified successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to verify otp !")


# update password
@app.post("/update-password")
async def update_password(data: SetNewPasswordSchema, db: AsyncSession = Depends(create_db_connection)):
    user_email = data.email
    user_new_password = data.password
    try:
        is_user = db.query(User).filter(User.email == user_email).first()
        if not is_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="profile not found !")
        else:
            is_user.password = hash_password(user_new_password)
            await db.commit()
            await db.refresh(is_user)
            return {"message": "password reseted successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to verify otp !")


# sends feedback mail
@app.post("/feedback")
async def send_feedback(feedback: Feedback, db: AsyncSession = Depends(create_db_connection)):
    user_name = feedback.name
    user_email = feedback.email
    user_feedback = feedback.feedback
    try:
        email_sub = "Feedback for Your Website"
        email_body = f"""
            Hello Tech Team,

            I would like to share the following feedback regarding your website.

            Name: {user_email}
            Feedback:
            {user_feedback}

            Thank you for taking the time to review my feedback. I appreciate your efforts to improve the website.

            Best regards,
            {user_name}
            """
        await send_mail(email_sub, user_email, email_body)
        return {"message": "feedback sended successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to send feedback email !")
