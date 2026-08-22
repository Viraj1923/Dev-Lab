from sqlalchemy import String, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    age: Mapped[int]
    email: Mapped[str] = mapped_column(String(150))
    password_hash: Mapped[str] = mapped_column(String(255))




# class User:
#     def __init__(self, id, name, age, email, password_hash):
#         self.id = id
#         self.name = name
#         self.age = age
#         self.email = email
#         self.password_hash = password_hash

# user = User(
#     1,
#     "Viraj",
#     22,
#     "viraj@example.com",
#     "hashed_password"
# )

# print(user.name)
# print(user.password_hash)

