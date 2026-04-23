from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.evidence_board import EvidenceBoardState


def get_by_match_id(db: Session, match_id: str) -> EvidenceBoardState | None:
    stmt = select(EvidenceBoardState).where(EvidenceBoardState.match_id == match_id)
    return db.scalar(stmt)


def save(db: Session, evidence_board_state: EvidenceBoardState) -> EvidenceBoardState:
    db.add(evidence_board_state)
    db.flush()
    db.refresh(evidence_board_state)
    return evidence_board_state
