from dataclasses import dataclass

from app.models.evidence_board import EvidenceBoardState
from app.models.match import Match
from app.models.pending_decision import PendingDecisionState
from app.models.player import PlayerState
from app.models.room import Room
from app.models.token_state import TokenState


@dataclass
class MatchSetupResult:
    room: Room
    match: Match
    player_state: PlayerState
    token_state: TokenState
    evidence_board_state: EvidenceBoardState
    pending_decision_state: PendingDecisionState
