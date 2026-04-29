from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import (
    match_repository,
    player_state_repository,
    token_state_repository,
)
from app.schemas.track import TrackResponse


def get_track(db: Session, match_id: str) -> TrackResponse:
    """試合に紐づく調査トラックの状態を返す。"""
    # 試合状態を取得する。
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    token_state = token_state_repository.get_by_match_id(db, match_id)
    if token_state is None:
        raise HTTPException(status_code=404, detail="token state not found")

    player_state = player_state_repository.get_by_match_id(db, match_id)
    if player_state is None:
        raise HTTPException(status_code=404, detail="player state not found")
    role_by_player_id = {
        player_id: state.get("role")
        for player_id, state in player_state.players_state_json.items()
    }

    evidence_tokens = [
        {
            "id": token.get("id", token_id),
            "position": token.get("track_position", 0),
            "colors": token.get("colors", []),
            "owner": role_by_player_id.get(token.get("owner_player_id")),
            "is_face_up": token.get("is_face_up", False),
            "has_bonus": token.get("has_bonus", False),
            "label": token.get("label", ""),
        }
        for token_id, token in token_state.evidence_tokens_state_json.items()
        if token.get("zone") == "track"
    ]
    evidence_tokens.sort(key=lambda token: token["id"])

    tokens_payload = {
        "initiative": {
            "id": "initiative",
            "position": token_state.initiative_state_json.get("track_position", 0),
            "owner": role_by_player_id.get(
                token_state.initiative_state_json.get("owner_player_id")
            ),
        },
        "power": {
            "id": "power",
            "position": token_state.power_state_json.get("track_position", 0),
            "owner": role_by_player_id.get(
                token_state.power_state_json.get("owner_player_id")
            ),
        },
        "evidence": evidence_tokens,
    }

    # track レスポンスを組み立てる。
    return TrackResponse(
        match_id=match.id,
        tokens=tokens_payload,
        version=match.version,
    )
