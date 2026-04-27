from uuid import uuid4

from app.models.card import Card
from app.models.pending_decision import PendingDecisionState


def build_counter_pending_decision(
    action_id: str,
    actor_player_id: str,
    counter_card_ids: list[str],
    played_card: Card,
    selected_part: str,
) -> dict:
    """カウンター確認用の pending_decision を構築する。

    params は `PendingPlayContextStore`（`app.repositories.pending_play_context_store`）に保持し、
    `source_action_id` で突き合わせる（永続層の JSON には含めない）。
    """
    return {
        "id": f"pd_{uuid4().hex[:8]}",
        "type": "is_counter_used",
        "actor_player_id": actor_player_id,
        "source_action_id": action_id,
        "constraints": {
            "counter_card_ids": counter_card_ids,
            "allow_pass": True,
        },
        "expires_at": None,
        "play_card": {
            "card_id": played_card.id,
            "name": played_card.name,
            "part": selected_part,
            "text": played_card.text,
        },
    }


def upsert_pending_decision_state(
    pending_decision_state: PendingDecisionState | None,
    match_id: str,
    pending_decision: dict,
) -> PendingDecisionState:
    """試合に対応する pending_decision_state を作成または更新する。"""
    if pending_decision_state is None:
        return PendingDecisionState(
            id=f"pds_{match_id}",
            match_id=match_id,
            pending_decision_json=pending_decision,
        )

    pending_decision_state.pending_decision_json = pending_decision
    return pending_decision_state
