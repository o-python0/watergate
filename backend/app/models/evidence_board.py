from typing import Any

from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import MatchScopedRecord


class EvidenceBoardState(MatchScopedRecord):
    """試合単位の証拠ボード状態をまとめて保持する。

    `evidence_board_state_json` の想定例:
    {
        "nodes": {
            "nix": {
                "id": "nix",
                "type": "nixon",
                "owner": null,
                "connections": ["ev_b_1", "ev_g_1"],
                "placed_evidence_id": null
            },
            "ev_b_1": {
                "id": "ev_b_1",
                "type": "evidence",
                "color": "blue",
                "owner": null,
                "connections": ["nix"],
                "placed_evidence_id": "ev_1"
            }
        }
    }
    """
    __tablename__ = "evidence_board_states"

    evidence_board_state_json: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
