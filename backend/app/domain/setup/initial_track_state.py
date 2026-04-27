_EVIDENCE_TOKEN_COLOR_PATTERNS = [
    (["blue"], 8),
    (["green"], 8),
    (["yellow"], 8),
    (["blue", "green"], 4),
    (["blue", "yellow"], 4),
    (["green", "yellow"], 4),
]


def build_initial_track_state() -> dict:
    """開始直後の調査トラック状態を構築する。"""
    return {
        "initiative": {
            "id": "initiative",
            "position": 0,
            "owner": None,
        },
        "power": {
            "id": "power",
            "position": 0,
            "owner": None,
        },
        "evidence": _build_initial_evidence_tokens(),
    }


def _build_initial_evidence_tokens() -> list[dict]:
    """開始直後の証拠トークン一覧を構築する。"""
    evidence_tokens: list[dict] = []
    token_number = 1

    for colors, count in _EVIDENCE_TOKEN_COLOR_PATTERNS:
        for _ in range(count):
            evidence_tokens.append(
                {
                    "id": f"ev_{token_number}",
                    "position": 0,
                    "colors": colors,
                    "owner": None,
                    "is_face_up": False,
                    "label": str(token_number),
                }
            )
            token_number += 1

    return evidence_tokens
