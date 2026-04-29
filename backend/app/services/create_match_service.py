from random import SystemRandom
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.domain.setup import start_match
from app.repositories import (
    card_repository,
    evidence_board_state_repository,
    match_repository,
    pending_decision_state_repository,
    player_state_repository,
    room_repository,
    token_state_repository,
)
from app.schemas.match_start import MatchCreatedResponse

_RANDOM = SystemRandom()

_ROLE_CARD_PREFIXES = {
    "nixon": "nx_",
    "editor": "ed_",
}


def create_match(db: Session, room_id: str) -> MatchCreatedResponse:
    """room からゲーム開始に必要な初期状態を作成する。"""
    # ゲーム開始対象の room を取得する。
    room = room_repository.get_by_id(db, room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="room not found")

    # 役職ごとのカード候補を収集し、初期状態を組み立てる。
    match_id = _generate_match_id()
    role_card_ids_by_role = {
        role: [card.id for card in card_repository.list_by_prefix(db, prefix)]
        for role, prefix in _ROLE_CARD_PREFIXES.items()
    }
    setup_result = start_match(
        room=room,
        match_id=match_id,
        role_card_ids_by_role=role_card_ids_by_role,
        rng=_RANDOM,
    )

    # 作成した各状態を保存して commit する。
    match_repository.save(db, setup_result.match)
    player_state_repository.save(db, setup_result.player_state)
    token_state_repository.save(db, setup_result.token_state)
    evidence_board_state_repository.save(db, setup_result.evidence_board_state)
    pending_decision_state_repository.save(db, setup_result.pending_decision_state)
    room_repository.save(db, setup_result.room)
    db.commit()

    # 開始結果として新しい match_id を返す。
    return MatchCreatedResponse(
        type="match_created",
        match_id=setup_result.match.id,
        version=setup_result.match.version,
    )


def _generate_match_id() -> str:
    """新規 match_id を生成する。"""
    return f"m_{uuid4().hex[:8]}"
