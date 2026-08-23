from pydantic import BaseModel

class UserRegister(BaseModel):
    name:str
    age:int
    email:str
    password:str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    age: int
    email: str

    class Config:
        from_attributes = True