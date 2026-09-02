from sqlalchemy import Column, Integer, String, select
from sqlalchemy.orm import declarative_base
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession
)
from pydantic import BaseModel
import httpx


DATABASE_URL = "sqlite+aiosqlite:///./final_async_api.db"

engine=create_async_engine(
    DATABASE_URL,
    echo=True
)

SessionLocal=async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)

Base=declarative_base()

app=FastAPI()

class UserCreate(BaseModel):
    name:str

class User(Base):
    __tablename__ = "users"

    id=Column(Integer,primary_key=True)
    name=Column(String)

async def get_db():
    async with SessionLocal() as db:
        yield db

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.post("/users")
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    user = User(name=user_data.name)

    db.add(user)

    await db.commit()

    await db.refresh(user)

    return {
        "id": user.id,
        "name": user.name
    }


@app.get("/dashboard")
async def see_dashboard(
    db: AsyncSession = Depends(get_db)
):
    async with httpx.AsyncClient() as client: #async with isn't a new function scope.
        response = await client.get("https://httpbin.org/get")

    result = await db.execute(
        select(User)
    )

    users = result.scalars().all()

    return {
        "users": [
            {
                "id": user.id,
                "name": user.name
            }
            for user in users
        ],
        "external_api_status": response.status_code
    }























