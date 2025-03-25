import { CardInfo, GameState, PlayerRole, Token, TokenColor } from "./types";

export const TOKEN_INITIAL_POSITION = 0;

// 色名から16進数カラーコードへの変換マップ
export const COLOR_TO_HEX_MAP: Record<TokenColor, string> = {
  red: "#e74c3c",
  blue: "#3498db",
  green: "#2ecc71",
};

// テスト用のトークン
export const TEST_TOKENS: Token[] = [
  {
    id: "initiative",
    type: "initiative",
    position: TOKEN_INITIAL_POSITION,
    displayColor: "#ffffff",
    owner: null,
    border: "#2c3e50",
    label: "I",
  },
  {
    id: "power",
    type: "power",
    position: TOKEN_INITIAL_POSITION,
    displayColor: "#e74c3c",
    owner: null,
    border: "#2c3e50",
    label: "P",
  },
  {
    id: 1,
    type: "evidence",
    position: TOKEN_INITIAL_POSITION,
    colors: ["red"],
    displayColor: "#808080",
    owner: null,
    label: "1",
    isFaceUp: false,
  },
  {
    id: 2,
    type: "evidence",
    position: TOKEN_INITIAL_POSITION,
    colors: ["blue", "green"],
    displayColor: "#808080",
    owner: null,
    label: "2",
    isFaceUp: true,
  },
];

// デフォルトのゲーム状態
export const DEFAULT_GAME_STATE: GameState = {
  track: {
    x: 300,
    yStart: 50,
    yEnd: 350,
    width: 120,
    cells: 11,
  },
  initiative: {
    id: "initiative",
    type: "initiative",
    position: TOKEN_INITIAL_POSITION,
    displayColor: "#ffffff",
    border: "#2c3e50",
    label: "I",
    owner: null,
  },
  power: {
    id: "power",
    type: "power",
    position: TOKEN_INITIAL_POSITION,
    displayColor: "#c0392b",
    border: "#2c3e50",
    label: "P",
    owner: null,
  },
  evidence: [
    {
      id: 1,
      type: "evidence",
      position: TOKEN_INITIAL_POSITION,
      colors: ["red" as TokenColor],
      displayColor: "#808080",
      owner: null,
      label: "1",
      isFaceUp: false,
    },
    {
      id: 2,
      type: "evidence",
      position: TOKEN_INITIAL_POSITION,
      colors: ["blue" as TokenColor],
      displayColor: "#808080",
      owner: null,
      label: "2",
      isFaceUp: false,
    },
    {
      id: 3,
      type: "evidence",
      position: TOKEN_INITIAL_POSITION,
      colors: ["blue", "green" as TokenColor],
      displayColor: "#808080",
      owner: null,
      label: "3",
      isFaceUp: false,
    },
  ],
  // プレイヤー情報
  players: {
    player1: {
      id: "player1",
      role: PlayerRole.NIXON,
      roundCapturedTokens: [],
      discardedCards: 0,
      excludedCards: 0,
      powerTokensCaptured: 0,
      remainingDeckCards: 20,
    },
    player2: {
      id: "player2",
      role: PlayerRole.EDITOR,
      roundCapturedTokens: [],
      discardedCards: 0,
      excludedCards: 0,
      powerTokensCaptured: 0,
      remainingDeckCards: 20,
    },
  },
  localPlayerId: "player1",
};

// トークン獲得位置
export const NIXON_CAPTURE_POSITION = -5;
export const EDITOR_CAPTURE_POSITION = 5;
// プレイヤー定義
export const PLAYERS = {
  NIXON: "nixson",
  EDITOR: "editor",
};

// -------------テストデータ------------------------------------------
// カードデータのテスト用サンプル
export const TEST_HAND_CARDS: CardInfo[] = [
  {
    id: "card1",
    name: "記者の執念",
    color: "green",
    image: "/images/cards/reporter-determination.png",
    actionPart: {
      actionType: "journalist",
      effectType: "moveToken",
      description: "イニシアチブマーカーを2マス自分側に移動",
      value: 2,
    },
    valuePart: {
      value: 3,
      tokenColors: ["blue", "green"],
    },
  },
  {
    id: "card2",
    name: "極秘資料",
    color: "orange",
    image: "/images/cards/classified-documents.png",
    actionPart: {
      actionType: "event",
      effectType: "moveToken",
      description: "証拠トークンを1つ3マスまで移動",
      value: 3,
    },
    valuePart: {
      value: 4,
      tokenColors: ["red"],
    },
  },
  {
    id: "card3",
    name: "ホワイトハウスの圧力",
    color: "orange",
    image: "/images/cards/whitehouse-pressure.png",
    actionPart: {
      actionType: "event",
      effectType: "moveToken",
      description: "いずれかのトークンを2マス自分側に移動",
      value: 2,
    },
    valuePart: {
      value: 2,
      tokenColors: ["red", "blue"],
    },
  },
  {
    id: "card4",
    name: "盗聴記録",
    color: "orange",
    image: "/images/cards/wiretap-records.png",
    actionPart: {
      actionType: "event",
      effectType: "discardOpponentCard",
      description: "相手の手札から1枚のカードを見て捨てさせる",
      value: 1,
    },
    valuePart: {
      value: 5,
      tokenColors: ["blue"],
    },
  },
  {
    id: "card5",
    name: "政府の否認",
    color: "orange",
    image: "/images/cards/government-denial.png",
    actionPart: {
      actionType: "event",
      effectType: "moveToken",
      description: "勢力トークンを1マス自分側に移動",
      value: 1,
    },
    valuePart: {
      value: 1,
      tokenColors: ["green", "red"],
    },
  },
];

// 実際の画像がない場合のフォールバック用
export const testHandCardsNoImages: CardInfo[] = TEST_HAND_CARDS.map(
  (card) => ({
    ...card,
    image: undefined,
  })
);
