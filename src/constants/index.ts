import { Card, GameState, TokenColor } from "./types";


// 色名から16進数カラーコードへの変換マップ
export const COLOR_TO_HEX_MAP: Record<TokenColor, string> = {
  'red': '#e74c3c',
  'blue': '#3498db',
  'green': '#2ecc71'
};

// デフォルトのゲーム状態
export const defaultGameState: GameState = {
  track: {
    x: 300,
    yStart: 50,
    yEnd: 350,
    width: 120,
    cells: 11
  },
  initiativeMarker: {
    position: 0,
    radius: 15,
    color: '#ffffff',
    border: '#2c3e50',
    label: 'I'
  },
  powerToken: {
    position: 0,
    radius: 15,
    color: '#e74c3c',
    border: '#2c3e50',
    label: 'P'
  },
  evidenceTokens: [
    { 
      id: 1, 
      position: 0, 
      colors: ['red' as TokenColor], 
      displayColor: '#808080',
      owner: null, 
      label: '1', 
      isFaceUp: false 
    },
    { 
      id: 2, 
      position: 0, 
      colors: ['blue' as TokenColor], 
      displayColor: '#808080',
      owner: null, 
      label: '2', 
      isFaceUp: false 
    },
    { 
      id: 3, 
      position: 0, 
      colors: ['green' as TokenColor], 
      displayColor: '#808080',
      owner: null, 
      label: '3', 
      isFaceUp: false 
    }
  ]
};



// -------------テストデータ------------------------------------------
// カードデータのテスト用サンプル
export const testHandCards: Card[] = [
  {
    id: 'card1',
    name: '記者の執念',
    image: '/images/cards/reporter-determination.png',
    actionPart: {
      effectType: 'moveToken',
      description: 'イニシアチブマーカーを2マス自分側に移動',
      value: 2
    },
    valuePart: {
      value: 3,
      description: '数値3分だけトークンを移動',
      tokenColors: ["blue", "green"]
    }
  },
  {
    id: 'card2',
    name: '極秘資料',
    image: '/images/cards/classified-documents.png',
    actionPart: {
      effectType: 'moveToken',
      description: '証拠トークンを1つ3マスまで移動',
      value: 3
    },
    valuePart: {
      value: 4,
      description: '数値4分だけトークンを移動',
      tokenColors: ['red']
    }
  },
  {
    id: 'card3',
    name: 'ホワイトハウスの圧力',
    image: '/images/cards/whitehouse-pressure.png',
    actionPart: {
      effectType: 'moveToken',
      description: 'いずれかのトークンを2マス自分側に移動',
      value: 2
    },
    valuePart: {
      value: 2,
      description: '数値2分だけトークンを移動',
      tokenColors: ['red', 'blue']
    }
  },
  {
    id: 'card4',
    name: '盗聴記録',
    image: '/images/cards/wiretap-records.png',
    actionPart: {
      effectType: 'discardOpponentCard',
      description: '相手の手札から1枚のカードを見て捨てさせる',
      value: 1
    },
    valuePart: {
      value: 5,
      description: '数値5分だけトークンを移動',
      tokenColors: ['blue']
    }
  },
  {
    id: 'card5',
    name: '政府の否認',
    image: '/images/cards/government-denial.png',
    actionPart: {
      effectType: 'moveToken',
      description: '勢力トークンを1マス自分側に移動',
      value: 1
    },
    valuePart: {
      value: 1,
      description: '数値1分だけトークンを移動',
      tokenColors: ['green', 'red']
    }
  }
];

// 実際の画像がない場合のフォールバック用
export const testHandCardsNoImages: Card[] = testHandCards.map(card => ({
  ...card,
  image: undefined
}));