from typing import Any

from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import MatchScopedRecord


class TokenState(MatchScopedRecord):
    """試合単位の各トークンの状態をまとめて保持する。

    `initiative_state_json` 例:
    {
        "track_position": 0,
        "owner_player_id": null
    }

    `power_state_json` 例:
    {
        "track_position": 0,
        "owner_player_id": null,
        "count": 5
    }

    `evidence_tokens_state_json` 例:
    {
        "ev_1": {
            "id": "ev_1",
            "zone": "track",
            "track_position": 0,
            "owner_player_id": null,
            "is_face_up": false,
            "has_bonus": true,
            "colors": ["blue"],
            "label": "1"
        },
        "ev_2": {
            "id": "ev_2",
            "zone": "board",
            "track_position": null,
            "owner_player_id": null,
            "is_face_up": true,
            "has_bonus": false,
            "colors": ["green", "yellow"],
            "label": "2"
        }
    }
    """

    __tablename__ = "token_states"

    initiative_state_json: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
    power_state_json: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
    evidence_tokens_state_json: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
