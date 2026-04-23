# Watergate
ボードゲーム「WaterGate（Matthias Cramer作）」のデジタル版です。
2人用のカードドリブンな対戦ゲームになります。


## ディレクトリ構成

```txt
backend/app/                                         # バックエンドアプリケーション本体のルート
├── main.py                                          # FastAPI の起動エントリポイント
├── db.py                                            # DB 接続やセッション管理
├── settings.py                                      # 環境変数や設定値の読み込み
│
├── api/                                             # API レイヤー
│   └── routes/                                      # エンドポイント定義
│       ├── health.py                                # ヘルスチェック API
│       ├── matches.py                               # 試合情報取得系 API
│       └── actions.py                               # プレイヤー操作受付 API
│
├── services/                                        # ユースケース単位の業務ロジック
│   ├── game_info_service.py                         # ゲーム全体情報の組み立て
│   ├── track_service.py                             # 調査トラック関連の処理
│   ├── evidence_board_service.py                    # 証拠ボード関連の処理
│   ├── player_state_service.py                      # プレイヤー状態取得・更新処理
│   ├── card_action_service.py                       # カード使用時の処理
│   └── decision_service.py                          # 保留中選択の解決処理
│
├── domain/                                          # ドメインルールと状態変化の中核
│   ├── entities/                                    # ドメインで扱う状態オブジェクト
│   │   ├── match_state.py                           # 試合全体の進行状態
│   │   └── pending_decision.py                      # プレイヤーの未確定選択状態
│   │
│   ├── rules/                                       # ゲーム進行上の判定ルール群
│   │   ├── turn_rule.py                             # 手番進行に関するルール
│   │   ├── card_phase_rule.py                       # カード解決フェーズのルール
│   │   ├── pending_decision_rule.py                 # 選択待ち状態の制御ルール
│   │   └── player_visibility_rule.py                # プレイヤーに見える情報の制御
│   │
│   └── resolvers/                                   # 効果解決や処理分配を担当
│       ├── effect_resolution_service.py             # 効果解決の統括サービス
│       └── effect_handlers/                         # 効果種別ごとの個別ハンドラ
│           ├── move_token.py                        # トークン移動処理
│           ├── flip_token.py                        # トークン反転処理
│           ├── select_board_node.py                 # 証拠ボード選択処理
│           └── counter.py                           # カウンター系効果処理
│
├── repositories/                                    # 永続化データへのアクセス層
│   ├── match_repository.py                          # 試合データの取得・保存
│   ├── player_state_repository.py                   # プレイヤー状態の取得・保存
│   ├── track_state_repository.py                    # 調査トラック状態の取得・保存
│   ├── evidence_board_state_repository.py           # 証拠ボード状態の取得・保存
│   └── pending_decision_state_repository.py         # 保留中選択状態の取得・保存
│
├── schemas/                                         # API 入出力用の Pydantic スキーマ
│   ├── common.py                                    # 共通レスポンス・基本型
│   ├── game_info.py                                 # ゲーム情報 API 用スキーマ
│   ├── track.py                                     # 調査トラック API 用スキーマ
│   ├── evidence_board.py                            # 証拠ボード API 用スキーマ
│   ├── players.py                                   # プレイヤー情報 API 用スキーマ
│   └── actions.py                                   # 操作受付 API 用スキーマ
│
└── models/                                          # ORM モデル定義
    ├── match.py                                     # 試合テーブル定義
    ├── player.py                                    # プレイヤーテーブル定義
    ├── track.py                                     # 調査トラックテーブル定義
    ├── evidence_board.py                            # 証拠ボードテーブル定義
    └── pending_decision.py                          # 保留中選択テーブル定義
```

## 開発環境の起動

```bash
docker compose up -d --build
```

## アクセス先

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

## バックエンド疎通確認

```bash
curl http://localhost:8000/health
```

`{"status":"ok"}` が返れば正常です。

## Frontend から Backend 連携

- `docker-compose.yml` で `REACT_APP_API_BASE_URL=http://localhost:8000` を設定済みです。
- `REACT_APP_USE_MOCK_API=false` を設定済みなので、コンテナ起動時は実 API を呼びます。
- Backend 側は `CORS_ORIGINS=http://localhost:3000` を許可する設定です。

