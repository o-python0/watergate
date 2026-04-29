from enum import Enum

from pydantic import BaseModel


class MatchStatus(str, Enum):
    IN_PROGRESS = "in_progress"
    FINISHED = "finished"


class Phase(str, Enum):
    PREPARATION = "preparation"
    CARD = "card"
    EVALUATION = "evaluation"


class CardSubphase(str, Enum):
    SELECT = "select"
    PENDING = "pending"
    RESOLVE = "resolve"


class NodeType(str, Enum):
    NIXON = "nixon"
    EVIDENCE = "evidence"
    INFORMANT = "informant"


class NodeOwner(str, Enum):
    NIXON = "nixon"
    EDITOR = "editor"
    JOURNALIST = "journalist"


class PendingType(str, Enum):
    IS_COUNTER_USED = "is_counter_used"
    SELECT_TOKEN_TO_MOVE = "select_token_to_move"
    SELECT_TOKEN_TO_FLIP = "select_token_to_flip"
    SELECT_BOARD_NODE = "select_board_node"


class HealthResponse(BaseModel):
    status: str
