from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.card import Card


def get_by_id(db: Session, card_id: str) -> Card | None:
    stmt = select(Card).where(Card.id == card_id)
    return db.scalar(stmt)


def list_by_ids(db: Session, card_ids: list[str]) -> list[Card]:
    if not card_ids:
        return []

    stmt = select(Card).where(Card.id.in_(card_ids))
    return list(db.scalars(stmt).all())


def save(db: Session, card: Card) -> Card:
    db.add(card)
    db.flush()
    db.refresh(card)
    return card
