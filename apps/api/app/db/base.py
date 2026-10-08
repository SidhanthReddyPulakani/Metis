from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

from app.models.auth_session import AuthSession
from app.models.user import User