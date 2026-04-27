from dataclasses import dataclass
from typing import Any

from app.domain.card_phase.card_play.player_state_access import get_opponent_player_id
from app.models.card import Card

# カウンター可否判定の集約モジュール。
# 文脈（role/action_type/part/params）から候補カードを導出し、
# 相手手札と突き合わせて最終的なカウンター可能カードIDを返す。


@dataclass(frozen=True)
class CounterContext:
    actor_role: str
    action_type: str
    part: str
    params: dict[str, Any]


@dataclass(frozen=True)
class CounterCheckResult:
    opponent_player_id: str
    counter_card_ids: list[str]

    @property
    def can_counter(self) -> bool:
        return bool(self.counter_card_ids)


# (実行者role, action_type, part) -> 相手が使えるカウンターカードID候補
_COUNTER_IDS_BY_CONTEXT: dict[tuple[str, str, str], set[str]] = {
    ("editor", "event", "action"): {"nx_13"},
    ("nixon", "associate", "action"): {"ed_13", "ed_18"},
    # value は action_type に依らず同条件で扱う
    ("nixon", "*", "value"): {"ed_20"},
}


def evaluate_counter_check(
    players_state: dict[str, dict],
    cards_by_id: dict[str, Card],
    player_id: str,
    played_card: Card,
    selected_part: str,
    execution_params: dict[str, Any],
) -> CounterCheckResult:
    """実行カードに対する相手のカウンター可否を判定して返す。"""
    # 1) 実行者の role を確定し、ルール判定用の文脈に使う。
    actor = players_state.get(player_id)
    if actor is None:
        raise ValueError("actor not found in players_state")
    actor_role = actor.get("role")
    if not isinstance(actor_role, str):
        raise ValueError("actor role is invalid")

    # 2) 相手プレイヤーと相手手札カードを取得する。
    opponent_player_id = get_opponent_player_id(players_state, player_id)
    opponent_hand = players_state[opponent_player_id].get("hand", [])
    opponent_cards = [
        cards_by_id[opponent_card_id]
        for opponent_card_id in opponent_hand
        if opponent_card_id in cards_by_id
    ]
    # 3) プレイ文脈（role/action_type/part/params）でルール評価する。
    counter_card_ids = find_counter_card_ids(
        opponent_cards,
        CounterContext(
            actor_role=actor_role,
            action_type=played_card.action_type,
            part=selected_part,
            params=execution_params,
        ),
    )
    # 4) 呼び出し側が分岐しやすい形で判定結果を返す。
    return CounterCheckResult(
        opponent_player_id=opponent_player_id,
        counter_card_ids=counter_card_ids,
    )


def _has_selected_tokens(params: dict[str, Any]) -> bool:
    token_ids = params.get("token_ids")
    return isinstance(token_ids, list) and len(token_ids) > 0


def find_counter_card_ids(opponent_cards: list[Card], ctx: CounterContext) -> list[str]:
    """相手手札のうち、今回の文脈で発動可能なカウンターカードIDを返す。"""
    opponent_card_ids = {opponent_card.id for opponent_card in opponent_cards}
    candidate_counter_ids = _candidate_counter_ids(ctx)
    return sorted(opponent_card_ids & candidate_counter_ids)


def _candidate_counter_ids(ctx: CounterContext) -> set[str]:
    direct_key = (ctx.actor_role, ctx.action_type, ctx.part)
    wildcard_key = (ctx.actor_role, "*", ctx.part)
    candidates = set(_COUNTER_IDS_BY_CONTEXT.get(direct_key, set()))
    candidates.update(_COUNTER_IDS_BY_CONTEXT.get(wildcard_key, set()))

    # ed_20 は value かつ token 選択時のみ有効
    if "ed_20" in candidates and not _has_selected_tokens(ctx.params):
        candidates.remove("ed_20")

    return candidates
