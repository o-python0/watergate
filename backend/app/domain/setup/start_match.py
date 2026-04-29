from random import Random

from app.domain.setup.initial_evidence_board_state import (
    build_initial_evidence_board_state,
)
from app.domain.setup.initial_player_state import (
    assign_roles,
    build_players_state,
    find_player_id_by_role,
)
from app.domain.setup.initial_token_state import build_initial_token_state
from app.domain.setup.result import MatchSetupResult
from app.domain.setup.room_validation import validate_room_for_start
from app.models.evidence_board import EvidenceBoardState
from app.models.match import Match
from app.models.pending_decision import PendingDecisionState
from app.models.player import PlayerState
from app.models.room import Room
from app.models.token_state import TokenState
from app.schemas.common import CardSubphase, MatchStatus, Phase


def start_match(
    room: Room,
    match_id: str,
    role_card_ids_by_role: dict[str, list[str]],
    rng: Random,
) -> MatchSetupResult:
    """room から試合開始時の各状態を組み立てる。"""
    # room の参加状態を検証し、役職と先手を決める。
    player_ids = validate_room_for_start(room)
    role_by_player_id = assign_roles(player_ids, rng)
    editor_player_id = find_player_id_by_role(role_by_player_id, "editor")

    # 試合レコードの作成
    match = Match(
        id=match_id,
        status=MatchStatus.IN_PROGRESS,
        round=1,
        phase=Phase.CARD,
        card_subphase=CardSubphase.SELECT,
        first_player_id=editor_player_id,
        current_player_id=editor_player_id,
        version=1,
        effect_stack_json=[],
    )

    # 各プレイヤーの初期手札・山札などを含む状態の作成
    player_state = PlayerState(
        id=f"ps_{match_id}",
        match_id=match_id,
        players_state_json=build_players_state(
            player_ids=player_ids,
            role_by_player_id=role_by_player_id,
            role_card_ids_by_role=role_card_ids_by_role,
            rng=rng,
        ),
    )

    # トークン状態の初期状態を作る。
    initial_token_state = build_initial_token_state()
    token_state = TokenState(
        id=f"tks_{match_id}",
        match_id=match_id,
        initiative_state_json=initial_token_state["initiative_state_json"],
        power_state_json=initial_token_state["power_state_json"],
        evidence_tokens_state_json=initial_token_state["evidence_tokens_state_json"],
    )

    # 証拠ボードの初期状態を作る。
    evidence_board_state = EvidenceBoardState(
        id=f"ebs_{match_id}",
        match_id=match_id,
        evidence_board_state_json=build_initial_evidence_board_state(),
    )

    # pending decision は未作成状態で初期化
    pending_decision_state = PendingDecisionState(
        id=f"pds_{match_id}",
        match_id=match_id,
        pending_decision_json=None,
    )

    # room を開始済みに更新
    room.status = "started"
    room.started_match_id = match_id

    # 呼び出し元が保存できるよう、作成した状態をまとめて返却
    return MatchSetupResult(
        room=room,
        match=match,
        player_state=player_state,
        token_state=token_state,
        evidence_board_state=evidence_board_state,
        pending_decision_state=pending_decision_state,
    )
