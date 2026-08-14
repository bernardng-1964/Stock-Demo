export type ValuationStatus = 'undervalued' | 'overvalued' | 'fair_value';

export type ChibiMascotId = 'penny' | 'bramble' | 'barnaby' | 'ollie' | 'pip';

export interface ChibiMascot {
  id: ChibiMascotId;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
  color: string;
  bgColor: string;
}

export type OrderAction = 'BUY' | 'SELL';

export type Timeframe = '1D' | '1W' | '1M' | 'YTD';

export interface StockInstrument {
  symbol: string;
  name: string;
  chibiName: string;
  mascotEmoji: string;
  sector: string;
  category: 'Gaming & Gadgets' | 'Toys & Cartoons' | 'Snacks & Fun' | 'Future Tech' | 'Everyday Life';
  kidExplanation: string;
  whatTheyMake: string[];
  lastPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  close: number;
  prevClose?: number;
  fairValue: number; // Ollie Owl's estimated true worth
  discountPercent: number; // e.g. +12% discount (bargain) or -8% (overpriced)
  marketCapKid: string; // e.g. "$3.1 Trillion (Mega Giant)"
  peRatioKid: string; // e.g. "28x (Normal Toy Multiplier)"
  dividendPocketMoney: string; // e.g. "$0.96 / year per share (Free Ice Cream Money!)"
  dividendYield: number;
  valuation: ValuationStatus;
  funFact: string;
  sparkline: number[];
  popularityRating: number; // 1-5 stars
}

export interface MarketIndex {
  symbol: string;
  name: string;
  chibiTitle: string;
  mascotEmoji: string;
  kidDesc: string;
  value: number;
  change: number;
  changePercent: number;
  timeframes: {
    [key in Timeframe]: {
      value: number;
      changePercent: number;
      sparkline: number[];
    };
  };
}

export interface NewsItem {
  id: string;
  time: string;
  date: string;
  headline: string;
  kidHeadline: string;
  kidExplanation: string;
  symbolTag?: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  mascotReaction: ChibiMascotId;
  reactionQuote: string;
  source: string;
}

export interface ChibiHoldings {
  [symbol: string]: {
    shares: number;
    avgPrice: number;
    totalInvested: number;
  };
}

export interface Transaction {
  id: string;
  time?: string;
  date: string;
  symbol: string;
  chibiName: string;
  type: OrderAction;
  price: number;
  qty: number;
  totalValue: number;
  mascotTip: string;
  status: string;
}

export interface ChibiBadge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PortfolioStats {
  walletChibiCoins: number; // Cash in piggy bank
  startingCoins: number;
  totalPortfolioValue: number; // Cash + Stock Value
  totalProfitLoss: number;
  totalProfitPercent: number;
  badges: ChibiBadge[];
  level: number;
  levelTitle: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  coinReward: number;
}

export interface AcademyLesson {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  mascot: ChibiMascotId;
  intro: string;
  story: string[];
  keyTakeaway: string;
  quiz: QuizQuestion;
}

export interface AIAdvisorResponse {
  answer: string;
  analogy: string;
  bargainVerdict: 'BARGAIN' | 'FAIR' | 'EXPENSIVE' | 'INFO';
  pennyRule: string;
  funFact: string;
  isAiGenerated: boolean;
}
