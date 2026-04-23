from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import evidence_board_state_repository, match_repository
from app.schemas.evidence_board import EvidenceBoardResponse


def get_evidence_board(db: Session, match_id: str) -> EvidenceBoardResponse:
    """試合に紐づく証拠ボードの状態を返す。"""
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    evidence_board_state = evidence_board_state_repository.get_by_match_id(db, match_id)
    if evidence_board_state is None:
        raise HTTPException(status_code=404, detail="evidence board state not found")

    return EvidenceBoardResponse(
        match_id=match.id,
        evidence_board=evidence_board_state.evidence_board_state_json,
        version=match.version,
    )
