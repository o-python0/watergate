import { Card } from "./types";


// カードデータのテスト用サンプル
export const testHandCards: Card[] = [
  {
    id: 'card1',
    name: '記者の執念',
    value: 3,
    actionEffect: 'イニシアチブマーカーを2マス自分側に移動',
    type: 'initiative',
    image: '/images/cards/reporter-determination.png'
  },
  {
    id: 'card2',
    name: '極秘資料',
    value: 4,
    actionEffect: '証拠トークンを1つ3マスまで移動',
    type: 'evidence',
    image: '/images/cards/classified-documents.png'
  },
  {
    id: 'card3',
    name: 'ホワイトハウスの圧力',
    value: 2,
    actionEffect: 'いずれかのトークンを2マス自分側に移動',
    type: 'power',
    image: '/images/cards/whitehouse-pressure.png'
  },
  {
    id: 'card4',
    name: '盗聴記録',
    value: 5,
    actionEffect: '相手の手札から1枚のカードを見て捨てさせる',
    type: 'evidence',
    image: '/images/cards/wiretap-records.png'
  },
  {
    id: 'card5',
    name: '政府の否認',
    value: 1,
    actionEffect: '勢力トークンを1マス自分側に移動',
    type: 'power',
    image: '/images/cards/government-denial.png'
  }
];

// 実際の画像がない場合のフォールバック用
export const testHandCardsNoImages: Card[] = testHandCards.map(card => ({
  ...card,
  image: undefined
}));