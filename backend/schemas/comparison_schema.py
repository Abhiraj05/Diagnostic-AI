from pydantic import BaseModel, Field

# report comparison schema
class ReportComparisonSchema:
    id:int =  Field(description="comparison id")
    user_id:int = Field(description="user id")
    previous_report_id:int = Field(description="previous report id")
    new_report_id:int =Field(description="new report id")
    summary:int = Field(description="reports comparison id")