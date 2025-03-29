// types.ts

// プレイヤーのロールを定義
export enum PlayerRole {
  NIXON = "nixon",
  EDITOR = "editor",
}

// トークンカラーの型
export type TokenColor = "red" | "blue" | "green";

// アクションパートの効果タイプ
export type ActionEffectType =
  | "moveToken" // トークン移動
  | "drawCard" // カードを引く
  | "discardOpponentCard" // 相手のカードを捨てさせる
  | "viewOpponentHand" // 相手の手札を見る
  | "returnToken" // トークンを元の位置に戻す
  | "swapTokens"; // トークンを入れ替える

// アクションパートの情報
export interface ActionPart {
  actionType: "event" | "conspirator" | "journalist";
  effectType: ActionEffectType;
  description: string; // 効果の説明文
  value: number; // 効果の値（移動量、カード枚数など）
}

// 数値パートの情報
export interface ValuePart {
  value: number; // カードの数値
  tokenColors: TokenColor[]; // 証拠トークンの色制約
}

// カードの基本情報
export interface CardInfo {
  id: string;
  name: string;
  color: string;
  image?: string;
  actionPart: ActionPart; // アクションパートの情報
  valuePart: ValuePart; // 数値パートの情報
}

// トークンタイプ定義
export type TokenType = "initiative" | "power" | "evidence";

// トークン型
export type Token = {
  id: string | number;
  type: "evidence" | "power" | "initiative";
  position: number;
  colors?: TokenColor[]; // initiative, powerは持たない
  displayColor: string;
  owner: string | null;
  border?: string;
  label: string;
  isFaceUp?: boolean; // initiative, powerは持たない
};

// 証拠トークンの型定義
export interface EvidenceToken {
  id: number; // 一意識別子
  position: number; // トラック上の位置
  colors: string[]; // 実際の色の配列
  displayColor: string; // 表示用の色の配列
  owner: string | null; // 所有プレイヤー
  label: string; // 表示ラベル
  isFaceUp: boolean; // 表向きかどうか
}

// トラック設定の型定義
export interface TrackConfig {
  x: number;
  yStart: number;
  yEnd: number;
  width: number;
  cells: number;
}

// プレイヤーの役職や手札情報を管理する型
export interface PlayerInfo {
  id: string; // プレイヤーID
  role: PlayerRole; // プレイヤーの役職
  name?: string; // プレイヤー名（オプション）

  hand?: CardInfo[]; // プレイヤーの手札
  remainingDeckCards?: number; // 残りデッキ枚数
  discardedCards?: CardInfo[]; // 捨て札
  excludedCards?: CardInfo[]; // 除外カード
  roundCapturedTokens?: string[]; // このラウンドで獲得したトークン
  powerTokensCaptured?: number; // 獲得した勢力トークン数
}

// ゲーム状態の型
export interface GameState {
  track: TrackConfig; // トラックの設定
  initiative: Token; // イニシアティブトークン
  power: Token; // パワートークン
  evidence: Token[]; // 証拠トークンのリスト
  localPlayerId: string; // ローカルプレイヤーのID（'player1' または 'player2'）
  firstPlayerId: string; // 先攻プレイヤーのID
}
