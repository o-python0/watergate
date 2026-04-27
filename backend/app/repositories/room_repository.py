from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.room import Room


def get_by_id(db: Session, room_id: str) -> Room | None:
    stmt = select(Room).where(Room.id == room_id)
    return db.scalar(stmt)


def save(db: Session, room: Room) -> Room:
    db.add(room)
    db.flush()
    db.refresh(room)
    return room
