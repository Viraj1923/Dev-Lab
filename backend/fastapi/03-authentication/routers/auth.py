from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from jwt import create_access_token
from auth import get_current_user

from database import get_db
from schemas.auth import UserRegister,UserLogin,UserResponse
from models.user import User
from password import hash_password,verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register")
def register_user(user:UserRegister,db:Session=Depends(get_db)):
    user_data=db.query(User).filter(User.email==user.email).first()
    if user_data: raise HTTPException(
                    status_code=400,
                    detail="Email already registered"
                )

    hashed_pass=hash_password(user.password)
    new_user=User(
        name=user.name,
        age=user.age,
        email=user.email,
        password_hash=hashed_pass
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return{"Msg":"User Created Successfully!"}

@router.post("/login")
def login_user(user:UserLogin,db:Session=Depends(get_db)):
    user_data=db.query(User).filter(User.email==user.email).first()
    if not user_data:raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        user_data.password_hash
    ):raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    access_token = create_access_token(
    {"sub": str(user_data.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    