from dataclasses import dataclass

from app.models.evidence_board import EvidenceBoardState
from app.models.match import Match
from app.models.pending_decision import PendingDecisionState
from app.models.player import PlayerState
from app.models.room import Room
from app.models.track import TrackState


@dataclass
class MatchSetupResult:
    room: Room
    match: Match
    player_state: PlayerState
    track_state: TrackState
    evidence_board_state: EvidenceBoardState
    pending_decision_state: PendingDecisionState
