from copy import deepcopy
from typing import Any

MOCK_MATCH_ID = "m_01jqxyz"
MOCK_VERSION = 42

_GAME_INFO: dict[str, Any] = {
    "match_id": MOCK_MATCH_ID,
    "status": "in_progress",
    "round": 2,
    "phase": "card",
    "card_subphase": "pending",
    "first_player_id": "p1",
    "current_player_id": "p1",
    "pending_decision": {
        "id": "pd_0009",
        "type": "is_counter_used",
        "actor_player_id": "p2",
        "source_action_id": "act_1002",
        "constraints": {
            "counter_card_ids": ["ed_09"],
            "allow_pass": True,
        },
        "expires_at": "2026-04-14T12:34:56Z",
    },
    "version": MOCK_VERSION,
}

_TRACK: dict[str, Any] = {
    "match_id": MOCK_MATCH_ID,
    "tokens": {
        "initiative": {
            "id": "initiative",
            "position": -1,
            "owner": None,
        },
        "power": {
            "id": "power",
            "position": 2,
            "owner": None,
        },
        "evidence": [
            {
                "id": "ev_1",
                "position": 0,
                "colors": ["blue"],
                "owner": None,
                "is_face_up": False,
                "has_bonus": True,
                "label": "1",
            },
            {
                "id": "ev_2",
                "position": 1,
                "colors": ["green", "yellow"],
                "owner": None,
                "is_face_up": True,
                "has_bonus": False,
                "label": "2",
            },
        ],
    },
    "version": MOCK_VERSION,
}

_EVIDENCE_BOARD: dict[str, Any] = {
    "match_id": MOCK_MATCH_ID,
    "evidence_board": {
        "nodes": {
            "nix": {
                "id": "nix",
                "type": "nixon",
                "owner": None,
                "connections": ["ev_b_1", "ev_g_1"],
                "placed_evidence_id": None,
            },
            "ev_b_1": {
                "id": "ev_b_1",
                "type": "evidence",
                "color": "blue",
                "owner": None,
                "connections": ["nix"],
                "placed_evidence_id": "ev_1",
            },
            "ev_g_1": {
                "id": "ev_g_1",
                "type": "evidence",
                "color": "green",
                "owner": "editor",
                "connections": ["nix"],
                "placed_evidence_id": None,
            },
            "inf_1": {
                "id": "inf_1",
                "type": "informant",
                "owner": None,
                "connections": ["ev_g_1"],
                "placed_photo_id": None,
            },
        }
    },
    "version": MOCK_VERSION,
}

_PLAYERS: dict[str, Any] = {
    "match_id": MOCK_MATCH_ID,
    "players": {
        "me": {
            "id": "p1",
            "seat": 0,
            "role": "nixon",
            "hand": ["nx_01", "nx_03", "nx_05"],
            "deck_count": 2,
            "discard": ["nx_02"],
            "excluded": [],
            "power_tokens_captured": 1,
            "round_captured_token_ids": [],
        },
        "opponent": {
            "id": "p2",
            "seat": 1,
            "role": "editor",
            "hand_count": 4,
            "deck_count": 1,
            "discard": ["ed_01"],
            "excluded": [],
            "power_tokens_captured": 0,
            "round_captured_token_ids": [],
        },
    },
    "version": MOCK_VERSION,
}


def get_game_info() -> dict[str, Any]:
    return deepcopy(_GAME_INFO)


def get_track() -> dict[str, Any]:
    return deepcopy(_TRACK)


def get_evidence_board() -> dict[str, Any]:
    return deepcopy(_EVIDENCE_BOARD)


def get_players() -> dict[str, Any]:
    return deepcopy(_PLAYERS)
