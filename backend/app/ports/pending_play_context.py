from typing import Any, Protocol


class PendingPlayContextStore(Protocol):
    """カード実行の入力（params 等）を一時的に保持するストア。単一プロセス or Redis 等に差し替え可。"""

    def get(self, action_id: str) -> dict[str, Any] | None: ...

    def put(self, action_id: str, context: dict[str, Any]) -> None: ...

    def pop(self, action_id: str) -> dict[str, Any] | None: ...
