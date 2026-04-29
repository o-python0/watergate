"""Card phase transition judgement helpers."""

from app.models.match import Match
from app.models.pending_decision import PendingDecisionState
from app.models.player import PlayerState


def is_card_phage_complete(
    match: Match,
    player_state: PlayerState,
    pending_decision_state: PendingDecisionState | None,
) -> bool:
    """カードフェーズを完了して評価フェーズへ遷移できるかを判定する。"""
    if (
        pending_decision_state is not None
        and pending_decision_state.pending_decision_json is not None
    ):
        return False

    if bool(match.effect_stack_json):
        return False

    players_state = player_state.players_state_json or {}
    if not players_state:
        return False

    for player in players_state.values():
        hand = player.get("hand", [])
        if len(hand) > 0:
            return False
    return True
