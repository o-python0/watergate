from pydantic import BaseModel

from app.schemas.common import CardSubphase, MatchStatus, Phase
from app.schemas.pending_decision import PendingDecisionResponse


class GameInfoResponse(BaseModel):
    match_id: str  # 試合を一意に識別する ID
    status: MatchStatus
    round: int
    phase: Phase
    card_subphase: CardSubphase  # カードフェーズ内の細かい進行段階
    first_player_id: str  # 先手プレイヤーの ID
    current_player_id: str  # 現在手番を持っているプレイヤーの ID
    pending_decision: PendingDecisionResponse | None = None  # 回答待ちの割り込み/選択要求。存在しない場合は None
    version: int  # 楽観ロックや同期確認に使う状態バージョン
