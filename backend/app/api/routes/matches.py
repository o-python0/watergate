from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.evidence_board import EvidenceBoardResponse
from app.schemas.game_info import GameInfoResponse
from app.schemas.players import PlayersResponse
from app.schemas.track import TrackResponse
from app.services.evidence_board_service import get_evidence_board
from app.services.game_info_service import get_game_info
from app.services.player_state_service import get_players
from app.services.track_service import get_track


router = APIRouter(prefix="/api/v1/matches", tags=["matches"])


@router.get("/{match_id}/game-info", response_model=GameInfoResponse)
def get_match_game_info(match_id: str, db: Session = Depends(get_db)) -> GameInfoResponse:
    return get_game_info(db, match_id)


@router.get("/{match_id}/track", response_model=TrackResponse)
def get_match_track(match_id: str, db: Session = Depends(get_db)) -> TrackResponse:
    return get_track(db, match_id)


@router.get("/{match_id}/evidence-board", response_model=EvidenceBoardResponse)
def get_match_evidence_board(
    match_id: str,
    db: Session = Depends(get_db),
) -> EvidenceBoardResponse:
    return get_evidence_board(db, match_id)


@router.get("/{match_id}/players", response_model=PlayersResponse)
def get_match_players(
    match_id: str,
    db: Session = Depends(get_db),
    player_id: str | None = Query(default=None),
) -> PlayersResponse:
    return get_players(db, match_id, request_player_id=player_id)
