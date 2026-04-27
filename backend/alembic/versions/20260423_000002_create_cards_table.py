"""create cards table

Revision ID: 20260423_000002
Revises: 20260423_000001
Create Date: 2026-04-23 00:00:02
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260423_000002"
down_revision = "20260423_000001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "cards",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("text", sa.Text(), nullable=True),
        sa.Column("image_path", sa.String(length=255), nullable=True),
        sa.Column("value", sa.Integer(), nullable=True),
        sa.Column("value_colors_json", sa.JSON(), nullable=False),
        sa.Column("action_type", sa.String(length=50), nullable=False),
        sa.Column("effects_json", sa.JSON(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("cards")
