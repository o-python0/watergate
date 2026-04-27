from fastapi import HTTPException

from app.models.match import Match
from app.models.pending_decision import PendingDecisionState
from app.schemas.common import CardSubphase, Phase

_VALID_PARTS = frozenset({"value", "action"})


def validate_execution_part(part: str) -> None:
    """カード実行 API の part が許容値か検証する。"""
    if part not in _VALID_PARTS:
        raise HTTPException(status_code=400, detail="part must be 'value' or 'action'")


def validate_play_card_start(
    match: Match,
    pending_decision_state: PendingDecisionState | None,
    player_id: str,
) -> None:
    """play-card を開始できる試合状態か検証する。"""
    if match.current_player_id != player_id:
        raise HTTPException(status_code=400, detail="not current player")

    if match.phase != Phase.CARD:
        raise HTTPException(status_code=400, detail="invalid phase")

    if match.card_subphase != CardSubphase.SELECT:
        raise HTTPException(status_code=400, detail="invalid card subphase")

    if (
        pending_decision_state is not None
        and pending_decision_state.pending_decision_json is not None
    ):
        raise HTTPException(status_code=400, detail="pending decision exists")


def validate_execute_card_preconditions(
    match: Match,
    pending_decision_state: PendingDecisionState | None,
    player_id: str,
    part: str,
    player: dict,
    card_id: str,
) -> None:
    """カード実行 API 入口で必要な事前検証をまとめて行う。"""
    validate_play_card_start(match, pending_decision_state, player_id)
    validate_execution_part(part)

    hand = player.get("hand", [])
    if card_id not in hand:
        raise HTTPException(status_code=400, detail="card not in hand")
