from pydantic import BaseModel

from app.schemas.common import NodeOwner, NodeType


class EvidenceBoardNodeResponse(BaseModel):
    id: str
    type: NodeType
    color: str | None = None
    owner: NodeOwner | None = None
    connections: list[str]
    placed_evidence_id: str | None = None
    placed_photo_id: str | None = None


class EvidenceBoardPayload(BaseModel):
    nodes: dict[str, EvidenceBoardNodeResponse]


class EvidenceBoardResponse(BaseModel):
    match_id: str
    evidence_board: EvidenceBoardPayload
    version: int
