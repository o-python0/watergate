"""seed sample cards

Revision ID: 20260423_000003
Revises: 20260423_000002
Create Date: 2026-04-23 00:00:03
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260423_000003"
down_revision = "20260423_000002"
branch_labels = None
depends_on = None


cards_table = sa.table(
    "cards",
    sa.column("id", sa.String(length=255)),
    sa.column("name", sa.String(length=255)),
    sa.column("text", sa.Text()),
    sa.column("image_path", sa.String(length=255)),
    sa.column("value", sa.Integer()),
    sa.column("value_colors_json", sa.JSON()),
    sa.column("action_type", sa.String(length=50)),
    sa.column("effects_json", sa.JSON()),
)


def upgrade() -> None:
    op.bulk_insert(
        cards_table,
        [
            {
                "id": "nx_03",
                "name": "1972年大統領選挙",
                "text": "任意の枚数の証拠トークンを任意の組み合わせで2ステップ移動する",
                "image_path": "/images/cards/nx_03.png",
                "value": 3,
                "value_colors_json": ["blue"],
                "action_type": "event",
                "effects_json": [
                    {
                        "type": "move_token",
                        "params": {
                            "value": 2,
                            "token_colors": ["blue", "green"],
                        },
                    }
                ],
            },
            {
                "id": "nx_10",
                "name": "チャック・コルソン",
                "text": "証拠トークンを2枚、それぞれ2マス移動する",
                "image_path": "/images/cards/nx_10.png",
                "value": 1,
                "value_colors_json": ["green", "yellow"],
                "action_type": "associate",
                "effects_json": [
                    {
                        "type": "move_token_multi",
                        "params": {
                            "mode": "per_token",
                            "count": 2,
                            "value": 2,
                            "token_colors": ["blue", "green"],
                        },
                    }
                ],
            },
            {
                "id": "ed_09",
                "name": "集団デモ",
                "text": "ニクソンの共謀者のアクションを1つ防ぐ",
                "image_path": "/images/cards/ed_09.png",
                "value": 1,
                "value_colors_json": ["green"],
                "action_type": "event",
                "effects_json": [
                    {
                        "type": "counter_editor",
                    }
                ],
            },
        ],
    )


def downgrade() -> None:
    op.execute(sa.text("""
            DELETE FROM cards
            WHERE id IN ('nx_03', 'nx_10', 'ed_09')
            """))
