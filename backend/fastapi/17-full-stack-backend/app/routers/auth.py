from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from ..core.jwt import create_access_token

from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
)

from ..database.database import get_db
from ..schemas.user import UserRegister, UserLogin, UserResponse,TokenResponse
from ..database.models import User
from ..core.security import hash_password, verify_password
from app.core.dependencies import get_current_user_id


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    user_data = db.query(User).filter(User.email == user.email).first()

    if user_data:
        raise EmailAlreadyRegisteredError

    hashed_pass = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pass
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    user_data = db.query(User).filter(User.email == user.email).first()

    if not user_data:
        raise InvalidCredentialsError

    if not verify_password(
        user.password,
        user_data.password_hash
    ):
        raise InvalidCredentialsError

    access_token=create_access_token(
        {"sub":str(user_data.id)}
    )
    return{
        "access_token":access_token,
        "token_type":"bearer"
    }




@router.get("/me")
def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user_data = db.query(User).filter(User.id == user_id).first()

    if not user_data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user_data