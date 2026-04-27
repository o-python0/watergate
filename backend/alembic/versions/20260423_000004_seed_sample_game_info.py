"""seed sample game info

Revision ID: 20260423_000004
Revises: 20260423_000003
Create Date: 2026-04-23 00:00:04
"""

from datetime import datetime

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260423_000004"
down_revision = "20260423_000003"
branch_labels = None
depends_on = None


matches_table = sa.table(
    "matches",
    sa.column("id", sa.String(length=255)),
    sa.column("status", sa.String(length=50)),
    sa.column("round", sa.Integer()),
    sa.column("phase", sa.String(length=50)),
    sa.column("card_subphase", sa.String(length=50)),
    sa.column("first_player_id", sa.String(length=255)),
    sa.column("current_player_id", sa.String(length=255)),
    sa.column("version", sa.Integer()),
    sa.column("created_at", sa.DateTime(timezone=True)),
    sa.column("updated_at", sa.DateTime(timezone=True)),
    sa.column("effect_stack_json", sa.JSON()),
)

pending_decision_states_table = sa.table(
    "pending_decision_states",
    sa.column("id", sa.String(length=255)),
    sa.column("match_id", sa.String(length=255)),
    sa.column("pending_decision_json", sa.JSON()),
)


def upgrade() -> None:
    now = datetime.utcnow()

    op.bulk_insert(
        matches_table,
        [
            {
                "id": "m_01jqxyz",
                "status": "in_progress",
                "round": 2,
                "phase": "card",
                "card_subphase": "select",
                "first_player_id": "p1",
                "current_player_id": "p1",
                "version": 1,
                "created_at": now,
                "updated_at": now,
                "effect_stack_json": [],
            }
        ],
    )

    op.bulk_insert(
        pending_decision_states_table,
        [
            {
                "id": "pds_m_01jqxyz",
                "match_id": "m_01jqxyz",
                "pending_decision_json": None,
            }
        ],
    )


def downgrade() -> None:
    op.execute(sa.text("""
            DELETE FROM pending_decision_states
            WHERE id = 'pds_m_01jqxyz'
            """))
    op.execute(sa.text("""
            DELETE FROM matches
            WHERE id = 'm_01jqxyz'
            """))
