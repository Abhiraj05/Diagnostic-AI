from pydantic import BaseModel, Field

# feedback schema
class FeedbackSchema(BaseModel):
    name: str = Field(description="name of the user")
    feedback: str = Field(description="user feedback")