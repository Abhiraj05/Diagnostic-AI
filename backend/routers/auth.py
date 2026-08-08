from fastapi import APIRouter
from schemas.userSchema import UserRegister , UserLogin
from services.auth.auth_services import register_user , login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"] #this is for swaggers
)

@router.post("/register")
async def register(user: UserRegister):
    return await register_user(user)

@router.post("/login")
async def login(user: UserLogin):
    return await login_user(user)

@router.get("/get_user")
async def get_user():
    return{
        "message": "User registration endpoint"
    }