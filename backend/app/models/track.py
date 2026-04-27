from typing import Any

from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import MatchScopedRecord


class TrackState(MatchScopedRecord):
    """試合単位の調査トラック状態をまとめて保持する。

    `track_state_json`例:
    {
        "initiative": {"id": "initiative", "position": -1, "owner": null},
        "power": {"id": "power", "position": 2, "owner": null},
        "evidence": [
            {
                "id": "ev_1",
                "position": 0,
                "colors": ["blue"],
                "owner": null,
                "is_face_up": false,
                "label": "1"
            }
        ]
    }
    """

    __tablename__ = "track_states"

    track_state_json: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
