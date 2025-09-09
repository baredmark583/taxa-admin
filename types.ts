// This file should ideally be shared between the frontend and backend,
// or generated from a single source of truth (like a Prisma schema).

export enum Suit {
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
  SPADES = 'SPADES',
}

export enum Rank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = 'T',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

export interface AdminUser {
    id: string;
    name: string;
    playMoney: number;
    realMoney: number;
    role: 'ADMIN' | 'MODERATOR' | 'PLAYER' | string;
}

// For Slots game
export interface SlotSymbol {
  id?: number;
  name: string;
  imageUrl: string;
  payout: number;
  weight: number;
}
