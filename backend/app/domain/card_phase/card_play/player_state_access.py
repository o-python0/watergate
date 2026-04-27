from fastapi import HTTPException


def get_player(players_state: dict[str, dict], player_id: str) -> dict:
    """指定プレイヤーの状態を返す。"""
    player = players_state.get(player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="player not found")

    return player


def get_opponent_player_id(players_state: dict[str, dict], player_id: str) -> str:
    """現在プレイヤー以外の対戦相手IDを返す。"""
    opponent_player_id = next(
        (candidate_id for candidate_id in players_state if candidate_id != player_id),
        None,
    )
    if opponent_player_id is None:
        raise HTTPException(status_code=404, detail="opponent not found")

    return opponent_player_id


def ensure_card_in_hand(player: dict, card_id: str) -> list[str]:
    """プレイヤー手札に対象カードが存在することを確認する。"""
    hand = player.get("hand", [])
    if card_id not in hand:
        raise HTTPException(status_code=400, detail="card not in hand")

    return hand


def list_all_hand_card_ids(players_state: dict[str, dict]) -> list[str]:
    """全プレイヤーの手札カードID一覧を返す。"""
    return [
        card_id
        for player in players_state.values()
        for card_id in player.get("hand", [])
    ]
