from typing import Any

from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import MatchScopedRecord


class PendingDecisionState(MatchScopedRecord):
    """試合中に未解決の入力待ちを1件保持する。

    `pending_decision_json`例:
    {
        "id": "pd_0009",
        "type": "is_counter_used",
        "actor_player_id": "p2",
        "source_action_id": "act_1002",
        "constraints": {
            "counter_card_ids": ["ed_09"],
            "allow_pass": true
        },
        "expires_at": "2026-04-14T12:34:56Z"
    }

    pending が存在しない場合は `None` を保持する。
    """
    __tablename__ = "pending_decision_states"

    pending_decision_json: Mapped[dict[str, Any] | None] = mapped_column(
        JSON, nullable=True
    )
