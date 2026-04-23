from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import match_repository, player_state_repository
from app.schemas.players import PlayersResponse


def get_players(
    db: Session,
    match_id: str,
    request_player_id: str | None = None,
) -> PlayersResponse:
    """閲覧プレイヤー視点の me / opponent 表示情報を返す。"""
    match = match_repository.get_by_id(db, match_id)
    if match is None:
        raise HTTPException(status_code=404, detail="match not found")

    player_state = player_state_repository.get_by_match_id(db, match_id)
    if player_state is None:
        raise HTTPException(status_code=404, detail="player state not found")

    players_state = player_state.players_state_json
    me_id = request_player_id or match.first_player_id
    if me_id not in players_state:
        raise HTTPException(status_code=404, detail="player not found")

    opponent_id = next((player_id for player_id in players_state if player_id != me_id), None)
    if opponent_id is None:
        raise HTTPException(status_code=404, detail="opponent not found")

    me_state = players_state[me_id]
    opponent_state = players_state[opponent_id]

    return PlayersResponse(
        match_id=match.id,
        players={
            "me": _build_me_player(me_id, me_state),
            "opponent": _build_opponent_player(opponent_id, opponent_state),
        },
        version=match.version,
    )


def _build_me_player(player_id: str, player_state: dict[str, Any]) -> dict[str, Any]:
    """自分用の表示データを構築する。"""
    return {
        "id": player_id,
        "seat": player_state["seat"],
        "role": player_state["role"],
        "hand": player_state.get("hand", []),
        "deck_count": len(player_state.get("deck", [])),
        "discard": player_state.get("discard", []),
        "excluded": player_state.get("excluded", []),
        "power_tokens_captured": player_state.get("power_tokens_captured", 0),
        "round_captured_token_ids": player_state.get("round_captured_token_ids", []),
    }


def _build_opponent_player(player_id: str, player_state: dict[str, Any]) -> dict[str, Any]:
    """相手用の表示データを秘匿情報を除いて構築する。"""
    return {
        "id": player_id,
        "seat": player_state["seat"],
        "role": player_state["role"],
        "hand_count": len(player_state.get("hand", [])),
        "deck_count": len(player_state.get("deck", [])),
        "discard": player_state.get("discard", []),
        "excluded": player_state.get("excluded", []),
        "power_tokens_captured": player_state.get("power_tokens_captured", 0),
        "round_captured_token_ids": player_state.get("round_captured_token_ids", []),
    }
