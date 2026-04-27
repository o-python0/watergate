from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import match_repository, track_state_repository
from app.schemas.track import TrackResponse


def get_track(db: Session, match_id: str) -> TrackResponse:
    """試合に紐づく調査トラックの状態を返す。"""
    # 試合状態を取得する。
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    # 調査トラック状態を取得する。
    track_state = track_state_repository.get_by_match_id(db, match_id)
    if track_state is None:
        raise HTTPException(status_code=404, detail="track state not found")

    # track レスポンスを組み立てる。
    return TrackResponse(
        match_id=match.id,
        tokens=track_state.track_state_json,
        version=match.version,
    )
