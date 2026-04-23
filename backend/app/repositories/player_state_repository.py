from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.player import PlayerState


def get_by_match_id(db: Session, match_id: str) -> PlayerState | None:
    stmt = select(PlayerState).where(PlayerState.match_id == match_id)
    return db.scalar(stmt)


def save(db: Session, player_state: PlayerState) -> PlayerState:
    db.add(player_state)
    db.flush()
    db.refresh(player_state)
    return player_state
