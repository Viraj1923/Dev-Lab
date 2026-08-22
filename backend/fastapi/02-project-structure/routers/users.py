from fastapi import APIRouter,Depends,HTTPException, status
from schemas.user import UserCreate,UserResponse
from sqlalchemy.orm import Session
from models.user import User
from database import get_db


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/",response_model=UserResponse)
def create_user(user: UserCreate,db: Session = Depends(get_db)):
    user_model = User(
        name=user.name,
        age=user.age,
        email=user.email,
        password_hash=user.password
    )

    db.add(user_model)
    db.commit()
    db.refresh(user_model)
    return user_model


# @router.get("/")
# def get_users():
#     return {"message": "Users Endpoint"}

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users=db.query(User).all()
    return users

@router.get("/{user_id}",response_model=UserResponse)
def get_user(user_id: int,db:Session=Depends(get_db)):
    user_data = db.query(User).filter(User.id == user_id).first()
    if not user_data:
            raise HTTPException(
                status_code=404, 
                detail="User Not Found"
        )
    return user_data