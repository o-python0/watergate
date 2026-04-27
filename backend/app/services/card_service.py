from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.card import Card
from app.repositories import card_repository
from app.schemas.actions import (
    CardActionConstraintsResponse,
    CardActionInputResponse,
    CardDetailItemResponse,
    CardDetailResponse,
)


def get_card(db: Session, card_id: str) -> Card:
    """カードIDに対応するカードマスタを返す。"""
    # 指定 ID のカードマスタを取得する。
    card = card_repository.get_by_id(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="card not found")

    return card


def get_cards_by_ids(db: Session, card_ids: list[str]) -> list[Card]:
    """指定したカードID順でカードマスタ一覧を返す。"""
    # 指定 ID 群のカードマスタを一括取得する。
    cards = card_repository.list_by_ids(db, card_ids)
    cards_by_id = {card.id: card for card in cards}

    # 欠落 ID がある場合はエラーにする。
    missing_card_ids = [card_id for card_id in card_ids if card_id not in cards_by_id]
    if missing_card_ids:
        raise HTTPException(
            status_code=404,
            detail=f"cards not found: {', '.join(missing_card_ids)}",
        )

    # 入力順どおりに並べて返す。
    return [cards_by_id[card_id] for card_id in card_ids]


def get_card_details(db: Session, card_ids: list[str]) -> CardDetailResponse:
    """カード実行に必要な詳細情報を複数カード分返す。"""
    if not card_ids:
        raise HTTPException(status_code=400, detail="ids is required")

    # 指定 ID 群を一括取得し、存在しない ID を検出する。
    cards = card_repository.list_by_ids(db, card_ids)
    cards_by_id = {card.id: card for card in cards}
    missing_card_ids = [card_id for card_id in card_ids if card_id not in cards_by_id]
    if missing_card_ids:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "message": "cards not found",
                "missing_ids": missing_card_ids,
            },
        )

    # 入力順を維持して詳細レスポンスを組み立てる。
    ordered_cards = [cards_by_id[card_id] for card_id in card_ids]
    return CardDetailResponse(
        cards=[_build_card_detail_item(card) for card in ordered_cards],
    )


def _build_card_detail_item(card: Card) -> CardDetailItemResponse:
    """カード1件分の詳細レスポンスを構築する。"""
    return CardDetailItemResponse(
        card_id=card.id,
        name=card.name,
        text=card.text,
        value=card.value,
        value_colors=card.value_colors_json,
        action=_build_action_inputs(card.effects_json),
    )


def _build_action_inputs(effects_json: list[dict]) -> list[CardActionInputResponse]:
    """カード効果から action 入力定義を組み立てる。"""
    action_inputs: list[CardActionInputResponse] = []
    for effect in effects_json:
        params = effect.get("params", {})
        input_kind = params.get("input_kind")
        if not isinstance(input_kind, str):
            continue

        allowed_faces = params.get("allowed_faces")
        allowed_colors = params.get("allowed_colors")
        action_inputs.append(
            CardActionInputResponse(
                input_kind=input_kind,
                constraints=CardActionConstraintsResponse(
                    allowed_faces=(
                        allowed_faces if isinstance(allowed_faces, list) else None
                    ),
                    allowed_colors=(
                        allowed_colors if isinstance(allowed_colors, list) else None
                    ),
                ),
            )
        )

    return action_inputs
