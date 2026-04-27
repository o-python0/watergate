from dataclasses import dataclass
from typing import Any

from app.models.match import Match
from app.models.pending_decision import PendingDecisionState
from app.models.player import PlayerState


@dataclass
class PlayCardResult:
    match: Match
    player_state: PlayerState
    pending_decision_state: PendingDecisionState | None
    action_id: str
    # カウンター待ちのときのみ。呼び出し元が PendingPlayContextStore.put する用。
    pending_execution_context: dict[str, Any] | None = None
