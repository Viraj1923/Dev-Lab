from enum import Enum
from pydantic import BaseModel


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskCreate(BaseModel):
    title: str
    description: str
    project_id: int
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    title: str
    description: str
    status: TaskStatus


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: TaskStatus
    project_id: int