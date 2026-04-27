from pydantic import BaseModel


class MatchCreatedResponse(BaseModel):
    type: str
    match_id: str
    version: int
