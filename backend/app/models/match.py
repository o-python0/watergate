from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseRecord
from app.schemas.common import CardSubphase, MatchStatus, Phase


class Match(BaseRecord):
    """試合進行の軸になるトップレベル状態。

    列で持つ項目:
    - status / round / phase / card_subphase
    - first_player_id / current_player_id
    - version
    - created_at / updated_at

    `effect_stack_json` の想定例:
    [
        {
            "action_id": "act_1002",
            "card_id": "nx_03",
            "effect_type": "moveToken",
            "status": "waiting_decision",
            "pending_type": "select_token_to_move"
        }
    ]
    """

    __tablename__ = "matches"

    status: Mapped[MatchStatus] = mapped_column(String(50), nullable=False)
    round: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    phase: Mapped[Phase] = mapped_column(String(50), nullable=False)
    card_subphase: Mapped[CardSubphase] = mapped_column(String(50), nullable=False)
    first_player_id: Mapped[str] = mapped_column(String(255), nullable=False)
    current_player_id: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
    effect_stack_json: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON, nullable=False, default=list
    )
