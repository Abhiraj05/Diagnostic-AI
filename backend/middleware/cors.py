from fastapi.middleware.cors import CORSMiddleware

# allowed origins
origins = ["http://localhost:3000"]

# middleware
def middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
