import asyncio

from sqlalchemy import Column, Integer, String, select
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base


DATABASE_URL = "sqlite+aiosqlite:///./async_test.db"

engine = create_async_engine(
    DATABASE_URL,
    echo=True
)

SessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)


async def main():

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:

        user = User(name="Viraj")

        db.add(user)

        await db.commit()

        print(f"Created user with id: {user.id}")

        result = await db.execute(
            select(User)
        )

        users = result.scalars().all()

        for user in users:
            print(user.id, user.name)


asyncio.run(main())