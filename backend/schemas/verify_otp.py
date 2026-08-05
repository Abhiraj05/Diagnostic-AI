from pydantic import BaseModel, Field

# verify otp schema
class VerifyOtpSchema(BaseModel):
    email: str = Field(description="user email")
    otp: int = Field(description="otp")
