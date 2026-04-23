from typing import Any

from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import MatchScopedRecord


class PlayerState(MatchScopedRecord):
    """試合単位のプレイヤー表示/内部状態をまとめて保持する。

    `players_state_json`例:
    {
        "p1": {
            "seat": 0,
            "role": "nixon",
            "hand": ["nx_01", "nx_03"],
            "deck": ["nx_10"],
            "discard": ["nx_02"],
            "excluded": [],
            "power_tokens_captured": 1,
            "round_captured_token_ids": []
        },
        "p2": {
            "seat": 1,
            "role": "editor",
            "hand": ["ed_02", "ed_04"],
            "deck": ["ed_12"],
            "discard": ["ed_01"],
            "excluded": [],
            "power_tokens_captured": 0,
            "round_captured_token_ids": []
        }
    }
    """
    __tablename__ = "player_states"

    players_state_json: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
