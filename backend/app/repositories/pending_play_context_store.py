from typing import Any

from app.ports.pending_play_context import PendingPlayContextStore


class InMemoryPendingPlayContextStore:
    """開発用: プロセス内 dict を使う `PendingPlayContextStore` 実装。"""

    def __init__(self) -> None:
        self._data: dict[str, dict[str, Any]] = {}

    def get(self, action_id: str) -> dict[str, Any] | None:
        return self._data.get(action_id)

    def put(self, action_id: str, context: dict[str, Any]) -> None:
        self._data[action_id] = context

    def pop(self, action_id: str) -> dict[str, Any] | None:
        return self._data.pop(action_id, None)


default_pending_play_context_store: PendingPlayContextStore = (
    InMemoryPendingPlayContextStore()
)
