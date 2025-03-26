import { CardInfo, PlayerRole } from "../constants/types";

// ロールに基づいたカードの取得
export const getCardsByRole = (role: PlayerRole): CardInfo[] => {
  return role === PlayerRole.NIXON ? [...NIXON_DECKS] : [...EDITOR_DECKS];
};

// 編集者側のデッキ
export const EDITOR_DECKS: CardInfo[] = [
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
    name: "潜入捜査",
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
    name: "ディープスロート",
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
export const testHandCardsNoImages: CardInfo[] = EDITOR_DECKS.map((card) => ({
  ...card,
  image: undefined,
}));

// --------ニクソン側のデッキ-----------------------------------
export const NIXON_DECKS: CardInfo[] = [
  {
    id: "card1",
    name: "政府の弁明",
    color: "red",
    image: "/images/cards/government-defense.png",
    actionPart: {
      actionType: "event",
      effectType: "moveToken",
      description: "イニシアチブマーカーを2マス自分側に移動",
      value: 2,
    },
    valuePart: {
      value: -3,
      tokenColors: ["blue", "green"],
    },
  },
  {
    id: "card2",
    name: "機密保持命令",
    color: "red",
    image: "/images/cards/secrecy-order.png",
    actionPart: {
      actionType: "event",
      effectType: "moveToken",
      description: "証拠トークンを1つ3マスまで移動",
      value: 3,
    },
    valuePart: {
      value: -4,
      tokenColors: ["red"],
    },
  },
  {
    id: "card3",
    name: "メディア操作",
    color: "red",
    image: "/images/cards/media-manipulation.png",
    actionPart: {
      actionType: "event",
      effectType: "moveToken",
      description: "いずれかのトークンを2マス自分側に移動",
      value: 2,
    },
    valuePart: {
      value: -2,
      tokenColors: ["red", "blue"],
    },
  },
  {
    id: "card4",
    name: "情報隠蔽",
    color: "red",
    image: "/images/cards/information-concealment.png",
    actionPart: {
      actionType: "event",
      effectType: "discardOpponentCard",
      description: "相手の手札から1枚のカードを見て捨てさせる",
      value: 1,
    },
    valuePart: {
      value: -5,
      tokenColors: ["blue"],
    },
  },
  {
    id: "card5",
    name: "公的否認",
    color: "red",
    image: "/images/cards/official-denial.png",
    actionPart: {
      actionType: "event",
      effectType: "moveToken",
      description: "勢力トークンを1マス自分側に移動",
      value: 1,
    },
    valuePart: {
      value: -1,
      tokenColors: ["green", "red"],
    },
  },
];
