"""create rooms table

Revision ID: 20260423_000005
Revises: 20260423_000004
Create Date: 2026-04-23 00:00:05
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260423_000005"
down_revision = "20260423_000004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "rooms",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("host_user_id", sa.String(length=255), nullable=False),
        sa.Column("player1_user_id", sa.String(length=255), nullable=True),
        sa.Column("player2_user_id", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("started_match_id", sa.String(length=255), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("rooms")
