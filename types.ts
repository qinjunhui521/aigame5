export enum GameMode {
  ENTERTAINMENT = 'ENTERTAINMENT',
  REAL = 'REAL'
}

export enum TradeDirection {
  LONG = '涨',
  SHORT = '跌'
}

export interface GameConfig {
  asset: string;
  amount: number;
  direction: TradeDirection;
  leverage: number;
  takeProfitPercent: number; // e.g. 20 for 20%
  stopLossPercent: number; // e.g. 10 for 10%
}

export interface UserState {
  hasWonOnce: boolean;
  balance: number;
  isRealModeUnlocked: boolean;
  usingExperienceGold: boolean;
}

export enum GameResultType {
  LOSS = 'LOSS',
  WIN_SMALL = 'WIN_SMALL',
  WIN_BIG = 'WIN_BIG'
}

export interface GameResult {
  type: GameResultType;
  pnlAmount: number;
  pnlPercent: number;
}

export type Language = 'zh' | 'en';