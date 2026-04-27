from random import Random

from fastapi import HTTPException

_ROLE_HAND_SIZES = {
    "nixon": 4,
    "editor": 5,
}


def assign_roles(player_ids: list[str], rng: Random) -> dict[str, str]:
    """参加プレイヤーへ nixon / editor をランダムに割り当てる。"""
    shuffled_player_ids = player_ids[:]
    rng.shuffle(shuffled_player_ids)
    return {
        shuffled_player_ids[0]: "editor",
        shuffled_player_ids[1]: "nixon",
    }


def find_player_id_by_role(role_by_player_id: dict[str, str], role: str) -> str:
    """指定 role のプレイヤーIDを返す。"""
    player_id = next(
        (
            candidate_id
            for candidate_id, candidate_role in role_by_player_id.items()
            if candidate_role == role
        ),
        None,
    )
    if player_id is None:
        raise HTTPException(status_code=400, detail=f"{role} player not found")

    return player_id


def build_players_state(
    player_ids: list[str],
    role_by_player_id: dict[str, str],
    role_card_ids_by_role: dict[str, list[str]],
    rng: Random,
) -> dict[str, dict]:
    """各プレイヤーの初期手札・山札・捨て札状態を構築する。"""
    players_state: dict[str, dict] = {}

    for seat, player_id in enumerate(player_ids):
        role = role_by_player_id[player_id]
        hand, deck = _build_role_cards(role, role_card_ids_by_role, rng)
        players_state[player_id] = {
            "seat": seat,
            "role": role,
            "hand": hand,
            "deck": deck,
            "discard": [],
            "excluded": [],
            "power_tokens_captured": 0,
            "round_captured_token_ids": [],
        }

    return players_state


def _build_role_cards(
    role: str,
    role_card_ids_by_role: dict[str, list[str]],
    rng: Random,
) -> tuple[list[str], list[str]]:
    """役職に応じた初期手札・山札を構築する。"""
    hand_size = _ROLE_HAND_SIZES[role]
    desired_total = hand_size + 1

    role_card_ids = role_card_ids_by_role.get(role, [])
    if not role_card_ids:
        raise HTTPException(status_code=400, detail=f"{role} cards not found")

    expanded_card_ids: list[str] = []
    while len(expanded_card_ids) < desired_total:
        expanded_card_ids.extend(role_card_ids)

    expanded_card_ids = expanded_card_ids[:desired_total]
    rng.shuffle(expanded_card_ids)

    return expanded_card_ids[:hand_size], expanded_card_ids[hand_size:]
