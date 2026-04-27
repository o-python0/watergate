from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseRecord


class Room(BaseRecord):
    """ゲーム開始前の待機部屋を保持する。"""

    __tablename__ = "rooms"

    host_user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    player1_user_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    player2_user_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="waiting")
    started_match_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
