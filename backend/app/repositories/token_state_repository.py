from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.token_state import TokenState


def get_by_match_id(db: Session, match_id: str) -> TokenState | None:
    stmt = select(TokenState).where(TokenState.match_id == match_id)
    return db.scalar(stmt)


def save(db: Session, token_state: TokenState) -> TokenState:
    db.add(token_state)
    db.flush()
    db.refresh(token_state)
    return token_state
