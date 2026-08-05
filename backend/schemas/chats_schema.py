from pydantic import BaseModel, Field

# messages schema
class ChatsSchema(BaseModel):
    user_id: int = Field(description="user id")
    user_msg: str = Field(description="user message")
    bot_msg: str = Field(description="bot message")
