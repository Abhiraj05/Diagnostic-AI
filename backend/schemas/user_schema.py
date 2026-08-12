from pydantic import BaseModel, Field
from typing import Literal

# user schema


class UserSchema(BaseModel):
    name: str = Field(description="name of the user")
    email: str = Field(description="user email id")
    gender: Literal["Male", "Female"] = Field(description="user gender")
    age: int = Field(description="user age")
    password: str = Field(description="user password")
