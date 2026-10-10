from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.security import (
    create_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)
from app.models.auth_session import AuthSession
from app.models.user import User


SESSION_DURATION = timedelta(days=7)


def register_user(
    db: Session,
    email: str,
    password: str,
) -> User:
    normalized_email = email.strip().lower()

    user = User(
        email=normalized_email,
        password_hash=hash_password(password),
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise ValueError("An account with this email already exists.")

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    normalized_email = email.strip().lower()

    user = db.scalar(
        select(User).where(User.email == normalized_email)
    )

    if user is None or not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def create_user_session(
    db: Session,
    user: User,
) -> tuple[str, AuthSession]:
    raw_token = create_session_token()

    session = AuthSession(
        user_id=user.id,
        token_hash=hash_session_token(raw_token),
        expires_at=datetime.now(timezone.utc) + SESSION_DURATION,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return raw_token, session


def revoke_user_session(
    db: Session,
    raw_token: str,
) -> None:
    token_hash = hash_session_token(raw_token)

    session = db.scalar(
        select(AuthSession).where(
            AuthSession.token_hash == token_hash,
            AuthSession.revoked_at.is_(None),
        )
    )

    if session is not None:
        session.revoked_at = datetime.now(timezone.utc)
        db.commit()