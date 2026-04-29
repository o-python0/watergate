"""create token states table

Revision ID: 20260429_000006
Revises: 20260423_000005
Create Date: 2026-04-29 01:10:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260429_000006"
down_revision = "20260423_000005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "token_states",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("match_id", sa.String(length=255), nullable=False),
        sa.Column("initiative_state_json", sa.JSON(), nullable=False),
        sa.Column("power_state_json", sa.JSON(), nullable=False),
        sa.Column("evidence_tokens_state_json", sa.JSON(), nullable=False),
    )
    op.create_index("ix_token_states_match_id", "token_states", ["match_id"])


def downgrade() -> None:
    op.drop_index("ix_token_states_match_id", table_name="token_states")
    op.drop_table("token_states")
