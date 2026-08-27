from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship

from database import Base


student_courses = Table(
    "student_courses",
    Base.metadata,
    Column(
        "student_id",
        Integer,
        ForeignKey("users.id")
    ),
    Column(
        "course_id",
        Integer,
        ForeignKey("courses.id")
    )
)


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    users = relationship(
        "User",
        secondary=student_courses,
        back_populates="courses"
    )