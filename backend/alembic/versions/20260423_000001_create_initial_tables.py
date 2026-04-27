"""create initial tables

Revision ID: 20260423_000001
Revises:
Create Date: 2026-04-23 00:00:01
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260423_000001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "matches",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("round", sa.Integer(), nullable=False),
        sa.Column("phase", sa.String(length=50), nullable=False),
        sa.Column("card_subphase", sa.String(length=50), nullable=False),
        sa.Column("first_player_id", sa.String(length=255), nullable=False),
        sa.Column("current_player_id", sa.String(length=255), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("effect_stack_json", sa.JSON(), nullable=False),
    )
    op.create_table(
        "player_states",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("match_id", sa.String(length=255), nullable=False),
        sa.Column("players_state_json", sa.JSON(), nullable=False),
    )
    op.create_index("ix_player_states_match_id", "player_states", ["match_id"])

    op.create_table(
        "track_states",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("match_id", sa.String(length=255), nullable=False),
        sa.Column("track_state_json", sa.JSON(), nullable=False),
    )
    op.create_index("ix_track_states_match_id", "track_states", ["match_id"])

    op.create_table(
        "evidence_board_states",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("match_id", sa.String(length=255), nullable=False),
        sa.Column("evidence_board_state_json", sa.JSON(), nullable=False),
    )
    op.create_index(
        "ix_evidence_board_states_match_id",
        "evidence_board_states",
        ["match_id"],
    )

    op.create_table(
        "pending_decision_states",
        sa.Column("id", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("match_id", sa.String(length=255), nullable=False),
        sa.Column("pending_decision_json", sa.JSON(), nullable=True),
    )
    op.create_index(
        "ix_pending_decision_states_match_id",
        "pending_decision_states",
        ["match_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_pending_decision_states_match_id", table_name="pending_decision_states"
    )
    op.drop_table("pending_decision_states")

    op.drop_index(
        "ix_evidence_board_states_match_id", table_name="evidence_board_states"
    )
    op.drop_table("evidence_board_states")

    op.drop_index("ix_track_states_match_id", table_name="track_states")
    op.drop_table("track_states")

    op.drop_index("ix_player_states_match_id", table_name="player_states")
    op.drop_table("player_states")

    op.drop_table("matches")
