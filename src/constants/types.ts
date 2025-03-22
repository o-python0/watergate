
export interface Card {
    id: string;
    name: string;
    value: number;
    actionEffect: string;
    type: CardType;
    image?: string;
  }

  export type CardType = 'evidence' | 'initiative' | 'power';