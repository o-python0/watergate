from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.domain.card_phase.card_play.apply_after_counter_pass import (
    apply_stored_card_play_after_counter_pass,
)
from app.domain.card_phase.card_play.player_state_access import get_opponent_player_id
from app.domain.card_phase.phase_transition_judge import is_card_phage_complete
from app.repositories import (
    match_repository,
    pending_decision_state_repository,
    player_state_repository,
)
from app.repositories.pending_play_context_store import (
    default_pending_play_context_store,
)
from app.schemas.actions import DecisionAcceptedResponse
from app.schemas.common import CardSubphase, PendingType, Phase
from app.services.card_service import get_card

_EXCLUDE_COUNTER_CARD_IDS = frozenset({"ed_13", "ed_18"})
_DISCARD_COUNTER_CARD_IDS = frozenset({"nx_13", "ed_20"})
_INVALIDATED_CARD_DESTINATION_BY_COUNTER = {
    **{card_id: "excluded" for card_id in _EXCLUDE_COUNTER_CARD_IDS},
    **{card_id: "discard" for card_id in _DISCARD_COUNTER_CARD_IDS},
}


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

    # 回答者が正しいプレイヤーかを確認
    actor_player_id = pending.get("actor_player_id")
    if actor_player_id != player_id:
        raise HTTPException(
            status_code=403, detail="player is not allowed to answer this pending"
        )
    pending_type = pending.get("type")
    if not isinstance(pending_type, str):
        raise HTTPException(status_code=400, detail="invalid pending: missing type")
    # pending type に応じた回答内容を検証する。
    _validate_pending_response(
        pending_type=pending_type,
        pending=pending,
        response=response,
    )

    source_action_id = pending.get("source_action_id")
    if not isinstance(source_action_id, str) or not source_action_id:
        raise HTTPException(
            status_code=400, detail="invalid pending: missing source_action_id"
        )
    # pending type に応じて回答を解決する。
    _resolve_pending_decision(
        db=db,
        match=match,
        match_id=match_id,
        pending_type=pending_type,
        response=response,
        source_action_id=source_action_id,
    )

    # pending を解消し、進行状態を更新する。
    pending_state.pending_decision_json = None
    match.card_subphase = CardSubphase.RESOLVE
    match.version += 1

    # カードフェーズ完了判定
    _advance_after_pending_resolution(
        db=db,
        match=match,
        match_id=match_id,
        pending_state=pending_state,
    )

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


def _advance_after_pending_resolution(
    db: Session,
    match,
    match_id: str,
    pending_state,
) -> None:
    """カードフェーズ完了判定を行い、評価フェーズに遷移するか、相手ターンへ移る。"""
    player_state = player_state_repository.get_by_match_id(db, match_id)
    if player_state is None:
        raise HTTPException(status_code=404, detail="player state not found")

    is_complete = is_card_phage_complete(
        match=match,
        player_state=player_state,
        pending_decision_state=pending_state,
    )
    if is_complete:
        # カードフェーズ完了の場合、評価フェーズへ遷移する。
        match.phase = Phase.EVALUATION
        return

    # カードフェーズ未完了の場合、手番を相手プレイヤーに移して次のターン
    players_state = player_state.players_state_json
    match.current_player_id = get_opponent_player_id(players_state, match.current_player_id)
    match.card_subphase = CardSubphase.SELECT


def _validate_pending_response(
    pending_type: str,
    pending: dict,
    response: dict,
) -> None:
    """想定通りのpending type かを判定し、そのtypeに応じた回答内容を検証する。"""
    if pending_type == PendingType.IS_COUNTER_USED.value:
        _validate_counter_response(pending=pending, response=response)
        return
    # 未対応のpending type の場合、エラーを返す。
    raise HTTPException(status_code=400, detail="unsupported pending type")


def _resolve_pending_decision(
    db: Session,
    match,
    match_id: str,
    pending_type: str,
    response: dict,
    source_action_id: str,
) -> None:
    """pending type ごとの回答適用処理をディスパッチする。"""
    if pending_type == PendingType.IS_COUNTER_USED.value:
        _apply_counter_decision(
            db=db,
            match=match,
            match_id=match_id,
            response=response,
            source_action_id=source_action_id,
        )
        return

    raise HTTPException(status_code=400, detail="unsupported pending type")


def _apply_counter_decision(
    db: Session,
    match,
    match_id: str,
    response: dict,
    source_action_id: str,
) -> None:
    """カウンターpendingを解決する。"""
    is_counter_used = response["is_counter_used"]
    ctx = default_pending_play_context_store.pop(source_action_id)
    if ctx is None:
        raise HTTPException(
            status_code=400,
            detail="execution context not found or expired",
        )

    if not is_counter_used:
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
        return

    counter_card_id = response.get("card_id")
    destination = _INVALIDATED_CARD_DESTINATION_BY_COUNTER.get(counter_card_id)
    if destination is None:
        return

    player_state = player_state_repository.get_by_match_id(db, match_id)
    if player_state is None:
        raise HTTPException(status_code=404, detail="player state not found")
    # 無効化したカードを所定の場所に移動する。
    _move_invalidated_card(
        player_state=player_state,
        actor_player_id=ctx["player_id"],
        invalidated_card_id=ctx["card_id"],
        destination=destination,
    )
    player_state_repository.save(db, player_state)


def _move_invalidated_card(
    player_state,
    actor_player_id: str,
    invalidated_card_id: str,
    destination: str,
) -> None:
    players_state = player_state.players_state_json
    actor = players_state[actor_player_id]
    hand = actor.get("hand", [])

    hand.remove(invalidated_card_id)
    destination_cards = actor.setdefault(destination, [])
    if destination == "excluded":
        if invalidated_card_id not in destination_cards:
            destination_cards.append(invalidated_card_id)
    else:
        destination_cards.append(invalidated_card_id)

    actor["hand"] = hand
    actor[destination] = destination_cards
    player_state.players_state_json = players_state
