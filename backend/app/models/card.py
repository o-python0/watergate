from typing import Any

from sqlalchemy import JSON, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseRecord


class Card(BaseRecord):
    """カードマスタを保持する。"""

    __tablename__ = "cards"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    text: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    value: Mapped[int | None] = mapped_column(Integer, nullable=True)
    value_colors_json: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)
    effects_json: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON, nullable=False, default=list
    )
