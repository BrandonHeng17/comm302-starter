export type MarketCategory = 
  | 'overview' 
  | 'indices' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'futures' 
  | 'bonds' 
  | 'heatmap' 
  | 'screener' 
  | 'calendar';

export type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';
export type ChartStyle = 'candle' | 'line' | 'area' | 'baseline';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface CandlestickPoint {
  time: string; // ISO or label
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolQuote {
  ticker: string;
  name: string;
  category: 'index' | 'stock' | 'crypto' | 'forex' | 'future' | 'bond';
  sector?: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  volumeText: string;
  marketCap?: number;
  marketCapText?: string;
  peRatio?: number;
  dividendYield?: number;
  beta?: number;
  eps?: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  technicalRating: TechnicalRating;
  oscillators: { buy: number; neutral: number; sell: number; rating: TechnicalRating };
  movingAverages: { buy: number; neutral: number; sell: number; rating: TechnicalRating };
  history: CandlestickPoint[];
  sparkline: number[];
  description?: string;
  currency: string;
  country?: string;
  lastUpdated?: number;
}

export interface SectorItem {
  id: string;
  name: string;
  weight: number; // percentage
  changePercent: number;
  marketCapText: string;
  topStock: {
    ticker: string;
    changePercent: number;
  };
  stocks: {
    ticker: string;
    name: string;
    marketCap: number;
    changePercent: number;
    price: number;
  }[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  countryCode: string;
  flag: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  actual: string | null;
  forecast: string;
  prior: string;
  unit?: string;
  period: string;
}

export interface WatchlistItem {
  ticker: string;
  addedAt: number;
  alertPrice?: number;
  notes?: string;
}

export interface PaperTradeOrder {
  id: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'FILLED' | 'PENDING' | 'CANCELLED';
}

export interface UserPortfolio {
  cash: number;
  equity: number;
  positions: {
    ticker: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
  }[];
  orders: PaperTradeOrder[];
}

export interface YieldCurvePoint {
  tenor: string;
  months: number;
  current: number;
  monthAgo: number;
  yearAgo: number;
}
