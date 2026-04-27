from fastapi import APIRouter

from app.schemas.common import HealthResponse

router = APIRouter()


# ヘルスチェックAPI
@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return {"status": "ok"}
