from app.domain.card_phase.card_play.effect_stack import build_effect_stack
from app.domain.card_phase.card_play.player_state_access import (
    ensure_card_in_hand,
    get_player,
)
from app.models.card import Card
from app.models.match import Match
from app.models.player import PlayerState
from app.schemas.common import CardSubphase


def apply_stored_card_play_after_counter_pass(
    match: Match,
    player_state: PlayerState,
    action_id: str,
    card: Card,
    acting_player_id: str,
) -> None:
    """相手がカウンターを使わない（パス）と回答したあと、保留していたカード使用を反映する。"""
    players_state = player_state.players_state_json
    player = get_player(players_state, acting_player_id)
    hand = ensure_card_in_hand(player, card_id=card.id)
    hand.remove(card.id)
    player.setdefault("discard", []).append(card.id)
    match.effect_stack_json = build_effect_stack(action_id, card)
    match.card_subphase = CardSubphase.RESOLVE
    player_state.players_state_json = players_state
