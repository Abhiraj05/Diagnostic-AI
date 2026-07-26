from sqlalchemy import Column, String
from sqlalchemy.orm import Relationship
from db.db_connection import Base


# user model
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    
    uploaded_files = Relationship(
        "UploadedFile",
        back_populates="user",
        cascade="all, delete"
    )
    
    chats = Relationship(
        "Chats",
        back_populates="user",
        cascade="all, delete"
    )
    
     