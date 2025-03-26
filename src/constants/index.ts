import { CardInfo, GameState, PlayerRole, Token, TokenColor } from "./types";

export const TOKEN_INITIAL_POSITION = 0;

// 色名から16進数カラーコードへの変換マップ
export const COLOR_TO_HEX_MAP: Record<TokenColor, string> = {
  red: "#e74c3c",
  blue: "#3498db",
  green: "#2ecc71",
};

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
      discardedCards: [],
      excludedCards: [],
      powerTokensCaptured: 0,
      remainingDeckCards: 20,
    },
    player2: {
      id: "player2",
      role: PlayerRole.EDITOR,
      roundCapturedTokens: [],
      discardedCards: [],
      excludedCards: [],
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
