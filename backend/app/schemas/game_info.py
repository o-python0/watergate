from pydantic import BaseModel

from app.schemas.common import CardSubphase, MatchStatus, Phase
from app.schemas.pending_decision import PendingDecisionResponse


class GameInfoResponse(BaseModel):
    match_id: str
    status: MatchStatus
    round: int
    phase: Phase
    card_subphase: CardSubphase
    first_player_id: str
    current_player_id: str
    pending_decision: PendingDecisionResponse | None = None
    version: int
