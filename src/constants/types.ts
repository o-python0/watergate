// types.ts

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
  effectType: ActionEffectType;
  description: string; // 効果の説明文
  value: number; // 効果の値（移動量、カード枚数など）
}

// 数値パートの情報
export interface ValuePart {
  value: number; // カードの数値
  description: string; // 数値効果の説明
  tokenColors: TokenColor[]; // 証拠トークンの色制約
}

// カードの基本情報
export interface Card {
  id: string;
  name: string;
  image?: string;
  actionPart: ActionPart; // アクションパートの情報
  valuePart: ValuePart; // 数値パートの情報
}

// トークンタイプ定義
export type TokenType = "initiative" | "power" | "evidence";

// 基本トークン型
export interface Token {
  position: number;
  radius: number;
  color: string;
  border: string;
  label: string;
}
export type TestToken = {
  id: string | number;
  type: "evidence" | "power" | "initiative";
  position: number;
  colors?: TokenColor[];
  displayColor: string;
  border?: string;
  label: string;
  isFaceUp?: boolean;
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

// ゲーム状態の型定義
export interface GameState {
  track: TrackConfig;
  initiativeMarker: Token;
  powerToken: Token;
  evidenceTokens: EvidenceToken[];
}
