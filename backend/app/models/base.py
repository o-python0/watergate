from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class BaseRecord(Base):
    __abstract__ = True

    id: Mapped[str] = mapped_column(String(255), primary_key=True)


class MatchScopedRecord(BaseRecord):
    __abstract__ = True

    match_id: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
