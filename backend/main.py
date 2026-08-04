from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, WebSocket, WebSocketDisconnect, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from middleware.cors import middleware
from schemas.user_schema import UserSchema
from schemas.mail_schema import MailSchema
from schemas.feedback_schema import FeedbackSchema
from schemas.verify_otp import VerifyOtpSchema
from schemas.set_new_password import SetNewPasswordSchema
from schemas.report_schema import ReportDetailsSchema
from schemas.file_schema import UploadedFileSchema
from schemas.chats_schema import ChatsSchema
from sql.models.user_model import User
from sql.models.file_model import UploadedFile
from sql.models.report_model import ReportDetails
from sql.models.comparison_model import ReportComparison
from sql.models.chats_model import Chats
from db.db_connection import create_db_connection
from auth.hash_password import hash_password, verify_password
from auth.jwt_token import create_token, get_current_user
from rag.extractor.extract_document_text import extract_document_text
from rag.extractor.extract_image_text import extract_image_text
from rag.chunks.generate_chunks import create_chunks
from rag.vector.vector_store import create_or_get_vector_db
from rag.chat.chatbot import extract_report_values, generate_summary, answer_user_query, generate_comparison_summary
from cache.redis_client import redis_connection
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from services.email_service import send_mail
from services.otp_generation import generate_otp, otp_key
from cache.redis_client import redis_connection
from datetime import date
from pathlib import Path

# app initialise
app = FastAPI()

# redis client connection
redis = redis_connection()

# middleware
middleware(app)

# checks whether new or older user & then register's user
@app.post("/auth/signup")
async def create_user(user: UserSchema, background_tasks: BackgroundTasks, db: AsyncSession = Depends(create_db_connection)):
    user_name = user.name
    user_email = user.email
    user_gender = user.gender
    user_age = user.age
    user_password = user.password

    try:
        user_query = (select(User).where(User.email == user_email))
        old_user_data = await db.execute(user_query)
        is_old_user = old_user_data.first()

        if is_old_user is None:
            new_user = User(name=user_name, email=user_email, gender=user_gender, age=user_age,
                            password=hash_password(user_password))
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)

            email_sub = "Registration Successful"
            email_body = f"""
            Hello {user_name},

            Your registration has been completed successfully, and your account has been activated.

            You can now sign in and access our services.

            If you have any questions or require assistance, please don't hesitate to contact our support team.

            Thank you for choosing us.

            Best regards,
            Tech Team
            """
            background_tasks.add_task(
                send_mail, email_sub, user_email, email_body)

            return {"message": "registered successfully !"}

        else:
            return HTTPException(status_code=status.HTTP_409_CONFLICT, detail="user already exist !")

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="registration failed !")


# checks credentials & login's user
@app.post("/auth/signin")
async def login(user: UserSchema, db: AsyncSession = Depends(create_db_connection)):
    user_email = user.email
    user_password = user.password

    try:
        user_query = (select(User).where(User.email == user_email))
        old_user_data = await db.execute(user_query)
        is_old_user = old_user_data.first()

        if is_old_user is None or not verify_password(user_password, is_old_user.password):
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials !")

        else:
            token = create_token({"sub": is_old_user.email})
            return {"message": "login successfully !", "access_token": token}

    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="login failed !")


# deletes user account & its history
@app.delete("/auth/delete")
async def delete_profile(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        user_query = (select(User).where(User.id == user_id))
        old_user_data = await db.execute(user_query)
        is_old_user = old_user_data.first()

        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            await db.delete(is_old_user)
            await db.commit()
            return {"message": "profile deleted successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to delete profile !")


# updates user account details
@app.put("/auth/update-profile")
async def update_profile(user: UserSchema, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        user_query = (select(User).where(User.id == user_id))
        old_user_data = await db.execute(user_query)
        is_old_user = old_user_data.first()
        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            is_old_user.name = user.name
            is_old_user.email = user.email
            await db.commit()
            await db.refresh(is_old_user)
            return {"message": "profile updated successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to updated profile !")


# sends reset password mail
@app.post("/auth/reset-password")
async def reset_password(email: MailSchema, background_tasks: BackgroundTasks, db: AsyncSession = Depends(create_db_connection)):
    recipient_email = email.recipient_email

    try:
        user_query = (select(User).where(User.email == recipient_email))
        old_user_data = await db.execute(user_query)
        is_old_user = old_user_data.first()
        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
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
            background_tasks.add_task(
                send_mail, email_sub, recipient_email, email_body)

            return {"message": "reset password mail sent successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to sent reset email !")


# verify otp
@app.post("/auth/verify-otp")
async def verify_otp(data: VerifyOtpSchema):
    user_email = data.email
    user_entered_otp = data.otp

    try:
        redis = redis_connection()
        is_otp = int(redis.get(otp_key(user_email)))
        if not is_otp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="otp not found !")

        elif user_entered_otp == is_otp:
            redis.delete(otp_key(user_email))

        return {"message": "otp verified successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to verify otp !")


# update password
@app.post("/auth/update-password")
async def update_password(data: SetNewPasswordSchema, background_tasks: BackgroundTasks, db: AsyncSession = Depends(create_db_connection)):
    user_email = data.email
    user_new_password = data.password

    try:
        user_query = (select(User).where(User.email == user_email))
        old_user_data = await db.execute(user_query)
        is_old_user = old_user_data.first()
        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            is_old_user.password = hash_password(user_new_password)
            await db.commit()
            await db.refresh(is_old_user)
            email_sub = "Password Reset Successful"
            email_body = f"""
            Hello,

            Your password has been reset successfully for the account associated with email address {user_email}.

            You can now log in using your new password.

            If you did not make this change, please contact our support team immediately to secure your account.

            Thank you,
            Tech Team
            """

            background_tasks.add_task(
                send_mail, email_sub, user_email, email_body)

            return {"message": "password updated successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to update password !")


# sends feedback mail
@app.post("/public/feedback")
async def send_feedback(feedback: FeedbackSchema, background_tasks: BackgroundTasks):
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

        background_tasks.add_task(send_mail, email_sub, user_email, email_body)

        return {"message": "feedback sent successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to send feedback email !")


# process the doument & create embeddings and store it in a vector db
@app.post("/chats/upload-file")
async def upload_file(file: UploadFile = File(...), current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id
    file_name = file.filename
    file_path = f"upload/{file_name}"
    file_extension = Path(file_name).suffix

    try:
        if not file_name:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="file not found !")

        doc_query = (select(UploadedFile).where(UploadedFile.user_id == user_id,
                                                UploadedFile.file_name == file_name))
        doc_data = await db.execute(doc_query)
        is_old_doc = doc_data.first()

        if is_old_doc is not None:
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

            new_doc = UploadedFile(user_id=user_id, file_name=file_name,
                                   file_path=file_path, upload_date=date.today())
            db.add(new_doc)
            await db.commit()
            await db.refresh(new_doc)
        else:
            return {"message": "embeddings already exist !"}

        if file_extension == "pdf":
            report_text = extract_document_text(file_name)
        elif file_extension == "jpg" or "png":
            report_text = extract_image_text(file_path)

        response = extract_report_values(report_text)
        if response is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to extract report values !")

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
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to generate summary !")

        new_report.extracted_text = report_text
        new_report.summary_text = summary

        db.add(new_report)
        await db.commit()
        await db.refresh(new_report)

        documents = create_chunks(report_text)
        chunks_ids = []

        for i, doc in enumerate(documents):
            doc.meta["source"] = file_name
            doc.meta["user_id"] = user_id
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
@app.websocket("/chats/document-chat")
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

    except WebSocketDisconnect as e:
        print(f"user disconnected. close code: {e.code}. ")


# gets chats files history
@app.get("/chats/get-chats-files")
async def get_chats(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        files_query = (select(UploadedFile).where(UploadedFile.user_id == user_id)
                       .order_by(desc(UploadedFile.upload_date)))
        files_data = await db.execute(files_query)
        is_files = files_data.all()
        if is_files is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="chats files history not found !")
        else:
            chats_files = [UploadedFileSchema(file) for file in is_files]
            return {"message": "chats files history fetched successfully !", "chats_files": chats_files}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetched chats files history !")


# gets specific file chats history
@app.get("/chats/get-chats/{id}")
async def get_chats(id: int, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        chats_query = (select(Chats).where(
            Chats.user_id == user_id, Chats.file_id == id))
        chats_data = await db.execute(chats_query)
        is_chats = chats_data.first()
        if is_chats is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="chats history not found !")
        else:
            chats_history = ChatsSchema(is_chats)
            return {"message": "chats history fetched successfully !", "chats_history": chats_history}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetched chats history !")


# deletes specific chat history
@app.delete("/chats/delete-chat/{id}")
async def delete_chat(id: int, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        file_query = (select(UploadedFile).where(
            UploadedFile.id == id, UploadedFile.user_id == user_id))
        file_data = await db.execute(file_query)
        is_file = file_data.first()
        if is_file is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="chats history not found !")
        else:
            await db.delete(is_file)
            await db.commit()
            return {"message": "chats history deleted successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to delete chat history !")


# gets latests report
@app.get("/analysis/get-report")
async def get_reports(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        reports_query = (select(UploadedFile, ReportDetails)
                         .join(ReportDetails, UploadedFile.id == ReportDetails.file_id)
                         .where(UploadedFile.user_id == user_id)
                         .order_by(desc(UploadedFile.upload_date))
                         .limit(1))
        reports_data = await db.execute(reports_query)
        is_reports = reports_data.all()

        if not is_reports:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="report not found !")
        else:
            latest_report = ReportDetailsSchema(is_reports)
            return {"message": "latest report fetched successfully !", "latest_report": latest_report}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetch latest reports !")


# gets latests reports
@app.get("/comparison/get-reports")
async def get_reports(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        reports_query = (select(UploadedFile, ReportDetails)
                         .join(ReportDetails, UploadedFile.id == ReportDetails.file_id)
                         .where(UploadedFile.user_id == user_id)
                         .order_by(desc(UploadedFile.upload_date))
                         .limit(2))
        reports_data = await db.execute(reports_query)
        is_reports = reports_data.all()

        if not is_reports:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="reports not found !")
        else:
            latest_reports = [ReportDetailsSchema(
                report) for report in is_reports]
            return {"message": "latest reports fetched successfully !", "latest_reports": latest_reports}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetch latest reports !")


# compare reports and generate summary
@app.post("/comparison/compare-reports")
async def compare_reports(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        reports_query = (select(ReportDetails)
                         .join(ReportDetails, UploadedFile.id == ReportDetails.file_id)
                         .where(UploadedFile.user_id == user_id)
                         .order_by(desc(UploadedFile.upload_date))
                         .limit(2))
        reports_data = await db.execute(reports_query)
        is_reports = reports_data.all()

        if not is_reports:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="reports not found !")
        elif len(is_reports) == 1:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="cannot generate a reports comparison summary !")
        else:
            recent_report_data = ReportDetailsSchema(is_reports[0])
            old_report_data = ReportDetailsSchema(is_reports[1])
            comparison_query = (select(ReportComparison).where(ReportComparison.user_id == user_id,
                                                               ReportComparison.previous_report_id == old_report_data.id, ReportComparison.new_report_id == recent_report_data.id))
            comparison_data = await db.execute(comparison_query)
            is_old_comparison = comparison_data.first()

            if is_old_comparison is not None:
                summary = generate_comparison_summary(
                    old_report_data, recent_report_data)

                if summary is None:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to generate summary !")
                else:
                    new_comparison = ReportComparison(user_id=user_id,
                                                      previous_report_id=old_report_data, new_report_id=recent_report_data, summary=summary)
                    db.add(new_comparison)
                    await db.commit()
                    await db.refresh(new_comparison)

                    return {"message": "reports comparison summary generated successfully !", "comparison_summary": summary}
            else:
                return {"message": "comparison summary already exist !", "comparison_summary": is_old_comparison.summary}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to fetch lastest reports !")
