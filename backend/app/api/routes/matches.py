from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.evidence_board import EvidenceBoardResponse
from app.schemas.game_info import GameInfoResponse
from app.schemas.match_start import MatchCreatedResponse
from app.schemas.players import PlayersResponse
from app.schemas.track import TrackResponse
from app.services import (
    create_match_service,
    evidence_board_service,
    game_info_service,
    player_state_service,
    track_service,
)

router = APIRouter(prefix="/api/v1/matches", tags=["matches"])


# ゲーム開始API
@router.post("/{room_id}/start", response_model=MatchCreatedResponse)
def start_match(room_id: str, db: Session = Depends(get_db)) -> MatchCreatedResponse:
    return create_match_service.create_match(db, room_id)


# ゲーム情報取得API
@router.get("/{match_id}/game-info", response_model=GameInfoResponse)
def get_match_game_info(
    match_id: str, db: Session = Depends(get_db)
) -> GameInfoResponse:
    return game_info_service.get_game_info(db, match_id)


# 調査トラック取得API
@router.get("/{match_id}/track", response_model=TrackResponse)
def get_match_track(match_id: str, db: Session = Depends(get_db)) -> TrackResponse:
    return track_service.get_track(db, match_id)


# 証拠ボード取得API
@router.get("/{match_id}/evidence-board", response_model=EvidenceBoardResponse)
def get_match_evidence_board(
    match_id: str,
    db: Session = Depends(get_db),
) -> EvidenceBoardResponse:
    return evidence_board_service.get_evidence_board(db, match_id)


# プレイヤー情報取得API
@router.get("/{match_id}/players", response_model=PlayersResponse)
def get_match_players(
    match_id: str,
    db: Session = Depends(get_db),
    player_id: str | None = Query(default=None),
) -> PlayersResponse:
    return player_state_service.get_players(db, match_id, request_player_id=player_id)
