from typing import Any

from pydantic import BaseModel


class PlayCardRequest(BaseModel):
    player_id: str
    card_id: str


class ActionAcceptedResponse(BaseModel):
    type: str
    match_id: str
    action_id: str
    version: int


class SubmitDecisionRequest(BaseModel):
    pending_decision_id: str
    player_id: str
    response: dict[str, Any]


class DecisionAcceptedResponse(BaseModel):
    type: str
    match_id: str
    pending_decision_id: str
    version: int
