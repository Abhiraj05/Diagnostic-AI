from schemas.userSchema import UserRegister , UserLogin

async def register_user(user):
      return {
        "message": "Register logic executed",
        "email": user.email
    }

async def login_user(user):
        return {
        "message": "Login logic executed",
        "email": user.email
    }