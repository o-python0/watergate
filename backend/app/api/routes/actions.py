from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.actions import (
    ActionAcceptedResponse,
    CardDetailResponse,
    DecisionAcceptedResponse,
    ExecuteCardRequest,
    SubmitDecisionRequest,
)
from app.services import (
    card_action_service,
    card_service,
    decision_service,
)

router = APIRouter(prefix="/api/v1/matches/{match_id}/card", tags=["card"])


# カード詳細取得API
@router.get("/detail", response_model=CardDetailResponse)
def get_action_card_detail(
    match_id: str,
    ids: str = Query(..., description="カードIDのカンマ区切り文字列"),
    db: Session = Depends(get_db),
) -> CardDetailResponse:
    _ = match_id
    card_ids = [card_id.strip() for card_id in ids.split(",") if card_id.strip()]
    return card_service.get_card_details(db, card_ids)


# カード実行API
@router.post("/execute", response_model=ActionAcceptedResponse)
def execute_match_card(
    match_id: str,
    request: ExecuteCardRequest,
    db: Session = Depends(get_db),
) -> ActionAcceptedResponse:
    return card_action_service.execute_card(
        db=db,
        match_id=match_id,
        player_id=request.player_id,
        card_id=request.card_id,
        part=request.part,
        params=request.params,
    )


# pending回答API
@router.post("/submit-decision", response_model=DecisionAcceptedResponse)
def submit_pending_decision(
    match_id: str,
    request: SubmitDecisionRequest,
    db: Session = Depends(get_db),
) -> DecisionAcceptedResponse:
    return decision_service.submit_decision(
        db=db,
        match_id=match_id,
        pending_decision_id=request.pending_decision_id,
        player_id=request.player_id,
        response=request.response,
    )
