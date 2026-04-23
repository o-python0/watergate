from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import match_repository, pending_decision_state_repository
from app.schemas.game_info import GameInfoResponse


def get_game_info(db: Session, match_id: str) -> GameInfoResponse:
    """試合の進行情報と現在の pending decision を返す。"""
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    pending_decision_state = pending_decision_state_repository.get_by_match_id(db, match_id)
    pending_decision = None
    # 割り込み処理が存在する場合、その内容を取得する
    if pending_decision_state is not None:
        pending_decision = pending_decision_state.pending_decision_json

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
