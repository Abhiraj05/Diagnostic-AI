from pydantic import BaseModel, Field, FilePath
from datetime import date

# uploaded file schema
class UploadedFileSchema(BaseModel):
    file_id: int = Field(description="file id")
    user_id: int = Field(description="user id")
    file_name: str = Field(description="file name")
    file_path: FilePath = Field(description="file path")
    upload_date: date = Field(description="file uploaded date")
