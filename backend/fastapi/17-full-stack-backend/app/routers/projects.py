from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user_id

from ..database.database import get_db
from ..database.models import Project
from ..schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])


# 1. CREATE project
@router.post(
    "/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED
)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    new_project = Project(
        name=project.name,
        description=project.description,
        owner_id=current_user_id,
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


# 2. GET all projects 
@router.get("/all_projects", response_model=list[ProjectResponse])
def get_all_projects(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    projects = db.query(Project).filter(
        Project.owner_id == current_user_id
    ).all()

    if not projects:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projects Not Found"
        )

    return projects


# 3. GET one project
@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project Not Found"
        )

    return project


# 4. UPDATE project
@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_update: ProjectCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    if project.owner_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this project",
        )

    project.name = project_update.name
    project.description = project_update.description

    db.commit()
    db.refresh(project)

    return project


# 5. DELETE project
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    if project.owner_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this project",
        )

    db.delete(project)
    db.commit()

    return None