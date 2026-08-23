from fastapi import APIRouter,Depends,HTTPException, status
from schemas.user import UserCreate, UserResponse, UserUpdate
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

@router.put("/{user_id}",response_model=UserResponse)
def update_user(user_id:int,user:UserUpdate,db:Session=Depends(get_db)):
    user_data = db.query(User).filter(User.id == user_id).first()
    if not user_data:
                raise HTTPException(
                    status_code=404, 
                    detail="User Not Found"
        )
    update_data = user.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user_data, key, value)

    db.commit()
    db.refresh(user_data)
    return user_data

@router.delete("/{user_id}")
def delete_user(user_id,db:Session=Depends(get_db)):
    user_data=db.query(User).filter(User.id==user_id).first()
    if not user_data:
                    raise HTTPException(
                        status_code=404, 
                        detail="User Not Found"
        )
    db.delete(user_data);
    db.commit()
    return {"message": "User deleted successfully"}
    
      