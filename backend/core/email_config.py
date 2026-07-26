from pydantic_settings import BaseSettings

# mail base settings
class Settings(BaseSettings):
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str

    # class Config:
    #     env_file = ".env"

settings = Settings()