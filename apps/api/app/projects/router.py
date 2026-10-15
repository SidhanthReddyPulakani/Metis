
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth.dependencies import CurrentUser
from app.db.dependencies import get_db
from app.projects.schemas import ProjectCreate, ProjectResponse
from app.projects.service import create_project

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project_endpoint(
    payload: ProjectCreate,
    current_user: CurrentUser,
    db: Session = Depends(get_db),
) -> ProjectResponse:
    return create_project(
        db=db,
        owner_id=current_user.id,
        payload=payload,
    )
