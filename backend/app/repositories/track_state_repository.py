from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.track import TrackState


def get_by_match_id(db: Session, match_id: str) -> TrackState | None:
    stmt = select(TrackState).where(TrackState.match_id == match_id)
    return db.scalar(stmt)


def save(db: Session, track_state: TrackState) -> TrackState:
    db.add(track_state)
    db.flush()
    db.refresh(track_state)
    return track_state
