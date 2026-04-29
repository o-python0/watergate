from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import PendingType


class PendingDecisionConstraints(BaseModel):
    counter_card_ids: list[str] | None = None
    allow_pass: bool | None = None
    selectable_token_ids: list[str] | None = None
    selectable_node_ids: list[str] | None = None


class PendingDecisionResponse(BaseModel):
    id: str
    type: PendingType
    actor_player_id: str
    source_action_id: str
    constraints: PendingDecisionConstraints
    expires_at: datetime | str | None = None
