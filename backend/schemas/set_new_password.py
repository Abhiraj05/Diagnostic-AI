from pydantic import BaseModel, Field

# set new password schema
class SetNewPasswordSchema(BaseModel):
    email: str = Field(description="user email")
    password: str = Field(description="user new password")
