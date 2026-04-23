from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.card import Card
from app.repositories import card_repository


def get_card(db: Session, card_id: str) -> Card:
    """カードIDに対応するカードマスタを返す。"""

    card = card_repository.get_by_id(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="card not found")

    return card


def get_cards_by_ids(db: Session, card_ids: list[str]) -> list[Card]:
    """指定したカードID順でカードマスタ一覧を返す。"""

    cards = card_repository.list_by_ids(db, card_ids)
    cards_by_id = {card.id: card for card in cards}

    missing_card_ids = [card_id for card_id in card_ids if card_id not in cards_by_id]
    if missing_card_ids:
        raise HTTPException(
            status_code=404,
            detail=f"cards not found: {', '.join(missing_card_ids)}",
        )

    return [cards_by_id[card_id] for card_id in card_ids]
