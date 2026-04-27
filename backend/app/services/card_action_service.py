from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.domain.card_phase.card_play import (
    build_counter_pending_decision,
    evaluate_counter_check,
    get_player,
    list_all_hand_card_ids,
    resolve_card_effect,
    upsert_pending_decision_state,
    validate_execute_card_preconditions,
)
from app.repositories import (
    match_repository,
    pending_decision_state_repository,
    player_state_repository,
)
from app.repositories.pending_play_context_store import (
    default_pending_play_context_store,
)
from app.schemas.actions import ActionAcceptedResponse
from app.schemas.common import CardSubphase
from app.services.card_service import get_card, get_cards_by_ids


def execute_card(
    db: Session,
    match_id: str,
    player_id: str,
    card_id: str,
    part: str,
    params: dict,
) -> ActionAcceptedResponse:
    """カード使用開始を受け付け、effect_stack と pending を更新する。"""
    # 試合・プレイヤー状態を取得する。
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    player_state = player_state_repository.get_by_match_id(db, match_id)
    if player_state is None:
        raise HTTPException(status_code=404, detail="player state not found")

    # pending 状態を取得し、実行可能かを検証する。
    pending_decision_state = pending_decision_state_repository.get_by_match_id(
        db, match_id
    )

    # 実行対象カードが手札にあることを検証する。
    card = get_card(db, card_id)
    players_state = player_state.players_state_json
    player = get_player(players_state, player_id)
    validate_execute_card_preconditions(
        match=match,
        pending_decision_state=pending_decision_state,
        player_id=player_id,
        part=part,
        player=player,
        card_id=card.id,
    )

    # domain側で必要になる手札カード情報を読み込む。
    action_id = _generate_action_id()
    hand_card_ids = list_all_hand_card_ids(players_state)
    hand_cards = get_cards_by_ids(db, hand_card_ids) if hand_card_ids else []
    cards_by_id = {hand_card.id: hand_card for hand_card in hand_cards}

    # カウンター判定処理
    counter_check = evaluate_counter_check(
        players_state=players_state,
        cards_by_id=cards_by_id,
        player_id=player_id,
        played_card=card,
        selected_part=part,
        execution_params=params,
    )
    if counter_check.can_counter:
        # カウンター可能なカードを持っていた場合、pending を作成して解決待ちへ進める。
        match.card_subphase = CardSubphase.PENDING
        pending_decision = build_counter_pending_decision(
            action_id=action_id,
            actor_player_id=counter_check.opponent_player_id,
            counter_card_ids=counter_check.counter_card_ids,
            played_card=card,
            selected_part=part,
        )
        pending_decision_state = upsert_pending_decision_state(
            pending_decision_state=pending_decision_state,
            match_id=match.id,
            pending_decision=pending_decision,
        )
        match.version += 1

        pending_decision_state_repository.save(db, pending_decision_state)
        match_repository.save(db, match)
        db.commit()
        default_pending_play_context_store.put(
            action_id,
            {
                "match_id": match.id,
                "player_id": player_id,
                "card_id": card.id,
                "part": part,
                "params": params,
            },
        )
        # 一旦プレイヤーにレスポンスを返却する
        return ActionAcceptedResponse(
            type="action_accepted",
            match_id=match.id,
            action_id=action_id,
            version=match.version,
        )

    # カウンターが発生しなかった場合、そのままカード効果を解決する。
    result = resolve_card_effect(
        match=match,
        player_state=player_state,
        pending_decision_state=pending_decision_state,
        player_id=player_id,
        card=card,
        action_id=action_id,
    )

    # 更新対象を保存して commit する。
    # カード効果によってトークンなどを獲得した場合、プレイヤーへ返却する
    pending_state_to_save = result.pending_decision_state
    if pending_state_to_save is not None:
        pending_decision_state_repository.save(db, pending_state_to_save)
        # プレイヤーにレスポンスを返却する
        # return ActionAcceptedResponse()

    player_state_repository.save(db, result.player_state)
    match_repository.save(db, result.match)
    db.commit()

    # 受理結果をレスポンスとして返す。
    return ActionAcceptedResponse(
        type="action_accepted",
        match_id=result.match.id,
        action_id=result.action_id,
        version=result.match.version,
    )


def _generate_action_id() -> str:
    """カード使用開始を識別する action_id を生成する。"""
    return f"act_{uuid4().hex[:8]}"
