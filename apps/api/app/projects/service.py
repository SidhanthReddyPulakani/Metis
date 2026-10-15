
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.projects.schemas import ProjectCreate


def create_project(
    db: Session,
    owner_id: UUID,
    payload: ProjectCreate,
) -> Project:
    project = Project(
        owner_id=owner_id,
        name=payload.name,
        description=payload.description,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project
