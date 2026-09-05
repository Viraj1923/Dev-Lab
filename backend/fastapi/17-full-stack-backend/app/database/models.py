from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

# Import the Base class from our database configuration.
from app.database.database import Base


# User model
# Represents a user in the users table.
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password_hash = Column(String)

    # One user can own multiple projects.
    projects = relationship("Project", back_populates="owner")


# Project model
# Represents a project in the projects table.
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

    # Foreign key connecting this project to its owner.
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Many projects can belong to one user.
    owner = relationship("User", back_populates="projects")

    # One project can contain multiple tasks.
    tasks = relationship("Task", back_populates="project")


# Task model
# Represents a task in the tasks table.
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)

    # Task status.
    status = Column(String, default="todo")

    # Foreign key connecting the task to a project.
    project_id = Column(Integer, ForeignKey("projects.id"))

    # Many tasks can belong to one project.
    project = relationship("Project", back_populates="tasks")