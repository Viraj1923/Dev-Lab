from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class User(BaseModel):
    name: str
    age: int = Field(ge=18, le=100)
    email: str | None = None


@app.post("/users")
def create_user(user: User):
    return user