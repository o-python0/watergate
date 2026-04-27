from typing import Any

from pydantic import BaseModel


class CardActionConstraintsResponse(BaseModel):
    allowed_faces: list[str] | None = None
    allowed_colors: list[str] | None = None


class CardActionInputResponse(BaseModel):
    input_kind: str
    constraints: CardActionConstraintsResponse


class CardDetailItemResponse(BaseModel):
    card_id: str
    name: str
    text: str | None = None
    value: int | None = None
    value_colors: list[str]
    action: list[CardActionInputResponse]


# カード詳細取得API
class CardDetailResponse(BaseModel):
    cards: list[CardDetailItemResponse]


class ActionAcceptedResponse(BaseModel):
    type: str
    match_id: str
    action_id: str
    version: int


# カード実行API
class ExecuteCardRequest(BaseModel):
    player_id: str
    card_id: str
    part: str
    params: dict[str, Any]


class SubmitDecisionRequest(BaseModel):
    pending_decision_id: str
    player_id: str
    response: dict[str, Any]


class DecisionAcceptedResponse(BaseModel):
    type: str
    match_id: str
    pending_decision_id: str
    version: int
