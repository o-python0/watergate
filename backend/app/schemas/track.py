from pydantic import BaseModel

from app.schemas.common import NodeOwner


class TrackPositionTokenResponse(BaseModel):
    id: str
    position: int
    owner: NodeOwner | None = None


class EvidenceTokenResponse(BaseModel):
    id: str
    position: int
    colors: list[str]
    owner: NodeOwner | None = None
    is_face_up: bool
    label: str


class TrackTokensResponse(BaseModel):
    initiative: TrackPositionTokenResponse
    power: TrackPositionTokenResponse
    evidence: list[EvidenceTokenResponse]


class TrackResponse(BaseModel):
    match_id: str
    tokens: TrackTokensResponse
    version: int
