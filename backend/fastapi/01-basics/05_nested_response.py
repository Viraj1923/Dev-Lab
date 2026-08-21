from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Address(BaseModel):
    city:str
    pincode:int

class UserCreate(BaseModel):
    name: str
    age: int
    address: Address

class UserResponse(BaseModel):
    name: str
    age: int
    address: Address


@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    return user