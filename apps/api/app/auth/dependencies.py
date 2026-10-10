from datetime import datetime, timezone
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.security import hash_session_token
from app.db.dependencies import get_db
from app.models.auth_session import AuthSession
from app.models.user import User


DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DbSession,
    metis_session: Annotated[str | None, Cookie()] = None,
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
    )

    if not metis_session:
        raise unauthorized

    session = db.scalar(
        select(AuthSession).where(
            AuthSession.token_hash
            == hash_session_token(metis_session),
            AuthSession.revoked_at.is_(None),
            AuthSession.expires_at > datetime.now(timezone.utc),
        )
    )

    if session is None:
        raise unauthorized

    user = db.get(User, session.user_id)

    if user is None or not user.is_active:
        raise unauthorized

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]