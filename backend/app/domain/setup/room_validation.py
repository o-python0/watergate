from fastapi import HTTPException

from app.models.room import Room


def validate_room_for_start(room: Room) -> list[str]:
    """ゲーム開始可能な room か検証し、参加プレイヤーIDを返す。"""
    player_ids = [room.player1_user_id, room.player2_user_id]
    if any(player_id is None for player_id in player_ids):
        raise HTTPException(status_code=400, detail="room is not full")

    normalized_player_ids = [
        player_id for player_id in player_ids if player_id is not None
    ]
    if len(set(normalized_player_ids)) != 2:
        raise HTTPException(status_code=400, detail="room players must be unique")

    if room.started_match_id is not None or room.status == "started":
        raise HTTPException(status_code=400, detail="room already started")

    return normalized_player_ids
