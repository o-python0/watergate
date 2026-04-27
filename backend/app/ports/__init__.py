"""アプリケーションとインフラの境界用 Protocol / 型定義。"""

from app.ports.pending_play_context import PendingPlayContextStore

__all__ = ["PendingPlayContextStore"]
