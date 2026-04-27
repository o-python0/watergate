_EVIDENCE_NODE_SEEDS = [
    {"id": "ev_b_1", "color": "blue", "connections": ["ev_x_1", "ev_g_1"]},
    {"id": "ev_g_1", "color": "green", "connections": ["ev_b_1", "ev_g_2"]},
    {"id": "ev_g_2", "color": "green", "connections": ["ev_g_1", "ev_y_1"]},
    {"id": "ev_y_1", "color": "yellow", "connections": ["ev_g_2", "ev_x_1"]},
    {"id": "ev_x_1", "color": "green", "connections": ["ev_y_1", "ev_b_1"]},
    {"id": "ev_x_2", "color": "yellow", "connections": ["ev_x_10", "ev_x_3"]},
    {"id": "ev_x_3", "color": "blue", "connections": ["ev_x_2", "ev_x_4"]},
    {"id": "ev_x_4", "color": "green", "connections": ["ev_x_3", "ev_x_5"]},
    {"id": "ev_x_5", "color": "yellow", "connections": ["ev_x_4", "ev_x_6"]},
    {"id": "ev_x_6", "color": "blue", "connections": ["ev_x_5", "ev_x_7"]},
    {"id": "ev_x_7", "color": "green", "connections": ["ev_x_6", "ev_x_8"]},
    {"id": "ev_x_8", "color": "yellow", "connections": ["ev_x_7", "ev_x_9"]},
    {"id": "ev_x_9", "color": "blue", "connections": ["ev_x_8", "ev_x_10"]},
    {"id": "ev_x_10", "color": "green", "connections": ["ev_x_9", "ev_x_2"]},
]

_INFORMANT_NODE_IDS = [
    "inf_1",
    "inf_2",
    "inf_3",
    "inf_4",
    "inf_5",
    "inf_6",
    "inf_7",
]


def build_initial_evidence_board_state() -> dict:
    """開始直後の証拠ボード状態を構築する。"""
    nodes = {
        "nix": {
            "id": "nix",
            "type": "nixon",
            "owner": None,
            "connections": [],
            "placed_evidence_id": None,
        }
    }

    for node_seed in _EVIDENCE_NODE_SEEDS:
        nodes[node_seed["id"]] = {
            "id": node_seed["id"],
            "type": "evidence",
            "color": node_seed["color"],
            "owner": None,
            "connections": node_seed["connections"],
            "placed_evidence_id": None,
        }

    for informant_node_id in _INFORMANT_NODE_IDS:
        nodes[informant_node_id] = {
            "id": informant_node_id,
            "type": "informant",
            "owner": None,
            "connections": [],
            "placed_evidence_id": None,
            "placed_photo_id": None,
        }

    return {"nodes": nodes}
