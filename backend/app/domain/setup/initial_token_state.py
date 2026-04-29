from random import Random

from app.domain.token.evidence_track_setup import pickup_evidence_for_track

# パワートークンの初期サプライ個数
_POWER_SUPPLY_COUNT = 9

_EVIDENCE_TOKEN_COLOR_PATTERNS = [
    (["blue"], 8),
    (["green"], 8),
    (["yellow"], 8),
    (["blue", "green"], 4),
    (["blue", "yellow"], 4),
    (["green", "yellow"], 4),
]


def build_initial_token_state(rng: Random) -> dict:
    """開始直後のトークン状態を構築する。"""
    # 証拠トークンの初期状態を構築
    evidence_tokens_state_json = _build_initial_evidence_tokens_state()
    # 調査トラックへ載せる証拠トークンをランダムピックアップ
    pickup_evidence_for_track(evidence_tokens_state_json, rng, count=3)
    return {
        "initiative_state_json": {
            "track_position": 0,
            "owner_player_id": None,
        },
        "power_state_json": {
            "track_position": 0,
            "owner_player_id": None,
            "count": _POWER_SUPPLY_COUNT,
        },
        "evidence_tokens_state_json": evidence_tokens_state_json,
    }


def _build_initial_evidence_tokens_state() -> dict[str, dict]:
    """規定パターン通りに証拠トークンの初期状態を構築する。
    """
    evidence_tokens: dict[str, dict] = {}
    token_number = 1

    for colors, count in _EVIDENCE_TOKEN_COLOR_PATTERNS:
        has_bonus_count = 4 if len(colors) == 1 else 0
        for _ in range(count):
            token_id = f"ev_{token_number}"
            evidence_tokens[token_id] = {
                "id": token_id,
                "zone": "supply",
                "track_position": None,
                "owner_player_id": None,
                "is_face_up": False,
                "has_bonus": has_bonus_count > 0,
                "colors": colors,
                "label": str(token_number),
            }
            has_bonus_count = max(has_bonus_count - 1, 0)
            token_number += 1

    return evidence_tokens
