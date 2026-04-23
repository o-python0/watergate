from pydantic import BaseModel


class MyPlayerStateResponse(BaseModel):
    id: str
    seat: int
    role: str
    hand: list[str]
    deck_count: int
    discard: list[str]
    excluded: list[str]
    power_tokens_captured: int
    round_captured_token_ids: list[str]


class OpponentPlayerStateResponse(BaseModel):
    id: str
    seat: int
    role: str
    hand_count: int
    deck_count: int
    discard: list[str]
    excluded: list[str]
    power_tokens_captured: int
    round_captured_token_ids: list[str]


class PlayersPayload(BaseModel):
    me: MyPlayerStateResponse
    opponent: OpponentPlayerStateResponse


class PlayersResponse(BaseModel):
    match_id: str
    players: PlayersPayload
    version: int
