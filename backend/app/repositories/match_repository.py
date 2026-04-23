from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.match import Match


def get_by_id(db: Session, match_id: str) -> Match | None:
    stmt = select(Match).where(Match.id == match_id)
    return db.scalar(stmt)


def save(db: Session, match: Match) -> Match:
    db.add(match)
    db.flush()
    db.refresh(match)
    return match
