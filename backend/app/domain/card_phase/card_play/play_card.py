from app.domain.card_phase.card_play.effect_stack import build_effect_stack
from app.domain.card_phase.card_play.player_state_access import (
    ensure_card_in_hand,
    get_player,
)
from app.domain.card_phase.card_play.result import PlayCardResult
from app.models.card import Card
from app.models.match import Match
from app.models.pending_decision import PendingDecisionState
from app.models.player import PlayerState
from app.schemas.common import CardSubphase


def resolve_card_effect(
    match: Match,
    player_state: PlayerState,
    pending_decision_state: PendingDecisionState | None,
    player_id: str,
    card: Card,
    action_id: str,
) -> PlayCardResult:
    """カウンター不可時のカード効果解決開始状態を適用する。"""
    # 実行プレイヤーの手札状態を取り出す。
    players_state = player_state.players_state_json
    player = get_player(players_state, player_id)
    hand = ensure_card_in_hand(player, card_id=card.id)
    # カウンター不可ルートのカード適用のみを行う。
    match.effect_stack_json = build_effect_stack(action_id, card)
    hand.remove(card.id)
    player.setdefault("discard", []).append(card.id)
    match.card_subphase = CardSubphase.RESOLVE
    if pending_decision_state is not None:
        pending_decision_state.pending_decision_json = None

    # 呼び出し元が保存できるよう、更新済みオブジェクトをまとめて返す。
    player_state.players_state_json = players_state
    match.version += 1

    return PlayCardResult(
        match=match,
        player_state=player_state,
        pending_decision_state=pending_decision_state,
        action_id=action_id,
    )


def play_card(
    match: Match,
    player_state: PlayerState,
    pending_decision_state: PendingDecisionState | None,
    player_id: str,
    card: Card,
    action_id: str,
    selected_part: str,
) -> PlayCardResult:
    """後方互換ラッパー。新規コードは resolve_card_effect を利用する。"""
    _ = selected_part
    return resolve_card_effect(
        match=match,
        player_state=player_state,
        pending_decision_state=pending_decision_state,
        player_id=player_id,
        card=card,
        action_id=action_id,
    )


def resolve_card_start(
    match: Match,
    player_state: PlayerState,
    pending_decision_state: PendingDecisionState | None,
    player_id: str,
    card: Card,
    action_id: str,
) -> PlayCardResult:
    """後方互換ラッパー。新規コードは resolve_card_effect を利用する。"""
    return resolve_card_effect(
        match=match,
        player_state=player_state,
        pending_decision_state=pending_decision_state,
        player_id=player_id,
        card=card,
        action_id=action_id,
    )
