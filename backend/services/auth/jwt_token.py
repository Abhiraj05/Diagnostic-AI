import os
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from dotenv import load_dotenv
from jwt import PyJWT, InvalidKeyError
from schemas.userSchema import User
from db.db_connection import create_db_connection

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

# creates jwt token
def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow()+timedelta(minutes=30)
    return PyJWT.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


oauth2scheme = OAuth2PasswordBearer(tokenUrl="login")

# get's the current loggedIn user
def get_current_user(token: str = Depends(oauth2scheme), db: Session = Depends(create_db_connection)):
    try:
        payload = PyJWT.decode(token, SECRET_KEY, algorithm=[ALGORITHM])
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        return user
    except InvalidKeyError:
        raise HTTPException(status_code=401)
