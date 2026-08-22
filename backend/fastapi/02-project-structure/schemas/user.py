from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    age: int
    email: str
    password: str

class UserResponse(BaseModel):
    name: str
    age: int
    email: str