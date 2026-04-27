from app.models.card import Card


def build_effect_stack(action_id: str, card: Card) -> list[dict]:
    """カードマスタの effects を effect_stack 形式へ展開する。"""
    return [
        {
            "action_id": action_id,
            "card_id": card.id,
            "effect_type": effect["type"],
            "params": effect.get("params", {}),
            "status": "pending",
        }
        for effect in card.effects_json
    ]
