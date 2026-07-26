from pydantic import BaseModel, Field

# mail schema
class MailSchema(BaseModel):
    email_sub: str = Field(description="email subject")
    recipient_email: str = Field(description="recipient email")
    email_body: str = Field(description="email body")
