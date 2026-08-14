# Diagnostic AI

Diagnostic AI is an AI-powered blood-report analysis platform that helps users upload, understand, track, compare, and chat with their medical reports.

The application combines OCR, AI summarization, RAG, document processing, authentication, OTP/password-reset flows, email services, and report history into a single full-stack platform.

---

## Features

### Blood Report Upload

- Upload blood reports as **PDF** or **image** files.
- Extract report information automatically.
- Store report metadata and extracted values.

### OCR-Based Extraction

- Uses **EasyOCR** to extract text from uploaded report images.
- Extracts important blood-report parameters such as:
  - Hemoglobin
  - WBC count
  - Platelet count
  - Blood sugar
  - And other supported parameters

### AI Report Summary

- Generates an AI-powered summary for uploaded reports.
- Presents important observations in a user-friendly format.

### Report History

- Maintains historical blood-report values.
- Allows users to view previously uploaded reports.

### Report Comparison

- Compares the latest report with previous reports.
- Highlights changes in blood parameters.
- Generates an automatic comparison summary.

### Chat With Reports

- Users can ask questions about uploaded reports.
- Uses **RAG (Retrieval-Augmented Generation)** to retrieve relevant document information.
- Uses **LangChain + ChromaDB** for document retrieval and vector search.

### Authentication & Account Management

- User registration and login.
- OTP verification.
- Password reset.
- Profile settings.
- Account deletion.
- Email notifications.

### Redis

Redis is used for:

- OTP storage
- OTP expiration
- Password-reset flows
- Background email queue support

### Email Services

Email functionality can be used for:

- Registration emails
- OTP emails
- Password-reset emails
- Feedback emails

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **AI/RAG:** LangChain, ChromaDB, Gemini
- **OCR:** EasyOCR
- **Cache/OTP:** Redis
- **Email:** SMTP / FastAPI-Mail
- **Migrations:** Alembic
- **Containerization:** Docker

---

## Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis
- Docker Desktop

### Backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## `.env`

Create `backend/.env`:

```env
MAIL_USERNAME=''
MAIL_PASSWORD=''
MAIL_FROM=''
MAIL_PORT='587'
MAIL_SERVER='smtp.gmail.com'

DATABASE_URL='postgresql+asyncpg://postgres:@localhost:5432/diagnostic_ai'
REDIS_URL='redis://localhost:6379/0'

GOOGLE_API_KEY=''
SECRET_KEY=''
```

Replace the empty values with your actual credentials.

For Gmail, use an **App Password** for `MAIL_PASSWORD`.

## PostgreSQL

Create the database:

```sql
CREATE DATABASE diagnostic_ai;
```

The application uses:

```env
DATABASE_URL='postgresql+asyncpg://postgres:@localhost:5432/diagnostic_ai'
```

## Alembic Migration

After changing SQLAlchemy models:

```bash
# PostgreSQL Database Configuration

# Update the `sqlalchemy.url` in your Alembic configuration with your PostgreSQL database credentials:

sqlalchemy.url = postgresql+psycopg://USERNAME:PASSWORD@HOST:PORT/DATABASE
alembic revision --autogenerate -m "update database"
alembic upgrade head
```



## Redis

Local Redis:

```bash
redis-server
redis-cli ping
```

Expected:

```text
PONG
```

Docker:

```bash
docker run -d --name diagnostic-ai-redis -p 6379:6379 redis:7-alpine
```

## FastAPI Mail

Install:

```bash
pip install fastapi-mail
```

Gmail SMTP settings:

```env
MAIL_USERNAME='your-email@gmail.com'
MAIL_PASSWORD='your-app-password'
MAIL_FROM='your-email@gmail.com'
MAIL_PORT='587'
MAIL_SERVER='smtp.gmail.com'
```

## Run FastAPI

```bash
cd backend
uvicorn app.main:app --reload
```

API:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

## Docker

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

Logs:

```bash
docker compose logs -f
```

Stop:

```bash
docker compose down
```

Rebuild:

```bash
docker compose up -d --build
```

## Quick Start

```bash
# Start infrastructure
docker compose up -d

# Backend
cd backend
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Application Screenshots
