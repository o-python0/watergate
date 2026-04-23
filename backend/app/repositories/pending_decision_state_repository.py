from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.pending_decision import PendingDecisionState


def get_by_match_id(db: Session, match_id: str) -> PendingDecisionState | None:
    stmt = select(PendingDecisionState).where(PendingDecisionState.match_id == match_id)
    return db.scalar(stmt)


def save(db: Session, pending_decision_state: PendingDecisionState) -> PendingDecisionState:
    db.add(pending_decision_state)
    db.flush()
    db.refresh(pending_decision_state)
    return pending_decision_state
