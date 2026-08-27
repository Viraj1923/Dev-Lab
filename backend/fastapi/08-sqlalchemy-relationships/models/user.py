from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    posts = relationship(
        "Post",
        back_populates="user"
    )

    profile = relationship(
        "Profile",
        back_populates="user",
        uselist=False
    )

    courses = relationship(
        "Course",
        secondary="student_courses",
        back_populates="users"
    )