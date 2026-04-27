from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.domain.card_phase.card_play.apply_after_counter_pass import (
    apply_stored_card_play_after_counter_pass,
)
from app.repositories import (
    match_repository,
    pending_decision_state_repository,
    player_state_repository,
)
from app.repositories.pending_play_context_store import (
    default_pending_play_context_store,
)
from app.schemas.actions import DecisionAcceptedResponse
from app.schemas.common import CardSubphase, PendingDecisionType
from app.services.card_service import get_card


def submit_decision(
    db: Session,
    match_id: str,
    pending_decision_id: str,
    player_id: str,
    response: dict,
) -> DecisionAcceptedResponse:
    """pending への回答を適用する（先勝ち・重複送信は 200 収束）。"""
    # 試合状態を取得する。
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    # 現在の pending を取得し、未存在なら最新状態を返す。
    pending_state = pending_decision_state_repository.get_by_match_id(db, match_id)
    if pending_state is None or pending_state.pending_decision_json is None:
        return DecisionAcceptedResponse(
            type="decision_accepted",
            match_id=match.id,
            pending_decision_id=pending_decision_id,
            version=match.version,
        )

    # pending id が不一致なら重複扱いとして最新状態を返す。
    pending = pending_state.pending_decision_json
    if pending.get("id") != pending_decision_id:
        return DecisionAcceptedResponse(
            type="decision_accepted",
            match_id=match.id,
            pending_decision_id=pending_decision_id,
            version=match.version,
        )

    # 回答権限と pending 種別を検証する。
    actor_player_id = pending.get("actor_player_id")
    if actor_player_id != player_id:
        raise HTTPException(
            status_code=403, detail="player is not allowed to answer this pending"
        )

    pending_type = pending.get("type")
    if pending_type != PendingDecisionType.IS_COUNTER_USED.value:
        raise HTTPException(status_code=400, detail="unsupported pending type")

    # 回答内容を制約に照らして検証する。
    _validate_counter_response(pending=pending, response=response)

    source_action_id = pending.get("source_action_id")
    if not isinstance(source_action_id, str) or not source_action_id:
        raise HTTPException(
            status_code=400, detail="invalid pending: missing source_action_id"
        )

    is_counter_used = response["is_counter_used"]
    if not is_counter_used:
        ctx = default_pending_play_context_store.pop(source_action_id)
        if ctx is None:
            raise HTTPException(
                status_code=400,
                detail="execution context not found or expired",
            )
        player_state = player_state_repository.get_by_match_id(db, match_id)
        if player_state is None:
            raise HTTPException(status_code=404, detail="player state not found")
        card = get_card(db, ctx["card_id"])
        apply_stored_card_play_after_counter_pass(
            match=match,
            player_state=player_state,
            action_id=source_action_id,
            card=card,
            acting_player_id=ctx["player_id"],
        )
        player_state_repository.save(db, player_state)
    else:
        default_pending_play_context_store.pop(source_action_id)

    # pending を解消し、進行状態を更新する。
    pending_state.pending_decision_json = None
    match.card_subphase = CardSubphase.RESOLVE
    match.version += 1

    # 更新結果を永続化してレスポンスを返す。
    pending_decision_state_repository.save(db, pending_state)
    match_repository.save(db, match)
    db.commit()

    return DecisionAcceptedResponse(
        type="decision_accepted",
        match_id=match.id,
        pending_decision_id=pending_decision_id,
        version=match.version,
    )


def _validate_counter_response(pending: dict, response: dict) -> None:
    is_counter_used = response.get("is_counter_used")
    if not isinstance(is_counter_used, bool):
        raise HTTPException(
            status_code=400, detail="response.is_counter_used must be bool"
        )

    constraints = pending.get("constraints", {})
    counter_card_ids = constraints.get("counter_card_ids", [])
    allow_pass = constraints.get("allow_pass", False)

    if is_counter_used:
        card_id = response.get("card_id")
        if not isinstance(card_id, str) or not card_id:
            raise HTTPException(status_code=400, detail="response.card_id is required")
        if card_id not in counter_card_ids:
            raise HTTPException(
                status_code=400, detail="response.card_id is not allowed"
            )
        return

    if not allow_pass:
        raise HTTPException(status_code=400, detail="pass is not allowed")
