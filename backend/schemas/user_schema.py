from pydantic import BaseModel, Field

# user schema
class UserSchema(BaseModel):
    id: str = Field(description="user id")
    name: str = Field(description="name of the user")
    email: str = Field(description="user email id")
    password: str = Field(description="user password")
