import copy

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import match_repository, pending_decision_state_repository
from app.repositories.pending_play_context_store import (
    default_pending_play_context_store,
)
from app.schemas.game_info import GameInfoResponse


def get_game_info(db: Session, match_id: str) -> GameInfoResponse:
    """試合の進行情報と現在の pending decision を返す。"""
    # 試合の進行状態を取得する。
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    # 現在の pending を取得する。
    pending_decision_state = pending_decision_state_repository.get_by_match_id(
        db, match_id
    )
    pending_decision = None
    # 割り込み処理が存在する場合、その内容を取得する。
    if (
        pending_decision_state is not None
        and pending_decision_state.pending_decision_json
    ):
        pending_decision = copy.deepcopy(pending_decision_state.pending_decision_json)
        src = pending_decision.get("source_action_id")
        if src and "play_card" in pending_decision:
            mem = default_pending_play_context_store.get(src)
            if mem is not None:
                pending_decision["play_card"]["params"] = mem.get("params", {})

    # game-info レスポンスを組み立てる。
    return GameInfoResponse(
        match_id=match.id,
        status=match.status,
        round=match.round,
        phase=match.phase,
        card_subphase=match.card_subphase,
        first_player_id=match.first_player_id,
        current_player_id=match.current_player_id,
        pending_decision=pending_decision,
        version=match.version,
    )
