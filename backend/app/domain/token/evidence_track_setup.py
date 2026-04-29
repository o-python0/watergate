from random import Random


def pickup_evidence_for_track(
    evidence_tokens_state_json: dict[str, dict],
    rng: Random,
    *,
    count: int = 3,
) -> list[str]:
    """調査トラックに載せる証拠トークンを supply から選ぶ。

    `zone == "supply"` のトークンだけを候補にし、指定枚数（デフォルト3枚）を選ぶ。
    選んだトークンはインプレースで `zone="track"`、`track_position=0`（中立・-5〜5 のスケール上の起点）
    に更新する。
    """
    supply_ids = [
        token_id
        for token_id, token in evidence_tokens_state_json.items()
        if token.get("zone") == "supply"
    ]
    if len(supply_ids) < count:
        raise ValueError(
            f"not enough evidence tokens in supply: need {count}, have {len(supply_ids)}"
        )

    chosen_ids = rng.sample(supply_ids, k=count)
    for token_id in chosen_ids:
        token = evidence_tokens_state_json[token_id]
        token["zone"] = "track"
        token["track_position"] = 0

    return chosen_ids
