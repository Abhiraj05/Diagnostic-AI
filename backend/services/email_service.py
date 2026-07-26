from fastapi_mail import ConnectionConfig, FastMail
from fastapi_mail import MessageSchema
from core.email_config import settings


# mail connection config
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)

# sends email to reciptent
async def send_mail(email_sub, recipient_email, email_body):
    message = MessageSchema(
        subject=email_sub,
        recipients=[recipient_email],
        body=email_body
    )
    await fm.send_message(message)
