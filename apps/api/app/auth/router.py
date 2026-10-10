from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.auth.dependencies import CurrentUser
from app.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from app.auth.security import hash_session_token
from app.auth.service import (
    authenticate_user,
    create_user_session,
    register_user,
    revoke_user_session,
)
from app.config import settings
from app.db.dependencies import get_db


router = APIRouter(prefix="/auth", tags=["Authentication"])

SESSION_COOKIE = "metis_session"
COOKIE_MAX_AGE = 7 * 24 * 60 * 60


def set_session_cookie(
    response: Response,
    token: str,
) -> None:
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        secure=settings.environment.lower() != "development",
        samesite="lax",
        path="/",
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        user = register_user(
            db,
            str(payload.email),
            payload.password,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    token, _ = create_user_session(db, user)
    set_session_cookie(response, token)

    return user


@router.post("/login", response_model=UserResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db,
        str(payload.email),
        payload.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token, _ = create_user_session(db, user)
    set_session_cookie(response, token)

    return user


@router.get("/me", response_model=UserResponse)
def get_me(user: CurrentUser):
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    db: Session = Depends(get_db),
    metis_session: Annotated[str | None, Cookie()] = None,
):
    if metis_session:
        revoke_user_session(db, metis_session)

    response.delete_cookie(
        key=SESSION_COOKIE,
        path="/",
        httponly=True,
        secure=settings.environment.lower() != "development",
        samesite="lax",
    )
    response.status_code = status.HTTP_204_NO_CONTENT
    return response