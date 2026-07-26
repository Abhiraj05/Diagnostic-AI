from pydantic import BaseModel, Field

# blood report summary schema
class SummaryOutput(BaseModel):
    summary: str = Field(description="summary about blood report")
