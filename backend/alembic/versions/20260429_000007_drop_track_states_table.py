"""drop track states table

Revision ID: 20260429_000007
Revises: 20260429_000006
Create Date: 2026-04-29 11:59:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260429_000007"
down_revision = "20260429_000006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_index("ix_track_states_match_id", table_name="track_states")
    op.drop_table("track_states")


def downgrade() -> None:
    op.create_table(
        "track_states",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("match_id", sa.String(length=255), nullable=False),
        sa.Column("track_state_json", sa.JSON(), nullable=False),
    )
    op.create_index("ix_track_states_match_id", "track_states", ["match_id"])
