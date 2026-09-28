import { SectorItem } from '../types';

export const SP500_SECTORS: SectorItem[] = [
  {
    id: 'technology',
    name: 'Technology',
    weight: 31.4,
    changePercent: 1.82,
    marketCapText: '$14.2T',
    topStock: { ticker: 'NVDA', changePercent: 3.64 },
    stocks: [
      { ticker: 'NVDA', name: 'NVIDIA Corp', marketCap: 3390, changePercent: 3.64, price: 138.25 },
      { ticker: 'AAPL', name: 'Apple Inc', marketCap: 3520, changePercent: 0.82, price: 231.41 },
      { ticker: 'MSFT', name: 'Microsoft Corp', marketCap: 3140, changePercent: 0.74, price: 422.50 },
      { ticker: 'AVGO', name: 'Broadcom Inc', marketCap: 840, changePercent: 2.15, price: 181.20 },
      { ticker: 'AMD', name: 'Advanced Micro Devices', marketCap: 252, changePercent: -1.08, price: 155.80 },
      { ticker: 'CRM', name: 'Salesforce Inc', marketCap: 280, changePercent: 1.12, price: 289.40 },
      { ticker: 'ORCL', name: 'Oracle Corp', marketCap: 485, changePercent: 2.95, price: 176.30 },
      { ticker: 'PLTR', name: 'Palantir Tech', marketCap: 96, changePercent: 6.02, price: 43.15 },
    ]
  },
  {
    id: 'financials',
    name: 'Financials',
    weight: 13.1,
    changePercent: 0.94,
    marketCapText: '$5.8T',
    topStock: { ticker: 'JPM', changePercent: 1.56 },
    stocks: [
      { ticker: 'JPM', name: 'JPMorgan Chase', marketCap: 635, changePercent: 1.56, price: 222.18 },
      { ticker: 'BAC', name: 'Bank of America', marketCap: 330, changePercent: 0.85, price: 42.10 },
      { ticker: 'WFC', name: 'Wells Fargo', marketCap: 210, changePercent: 1.20, price: 58.90 },
      { ticker: 'GS', name: 'Goldman Sachs', marketCap: 170, changePercent: 1.42, price: 512.30 },
      { ticker: 'MS', name: 'Morgan Stanley', marketCap: 180, changePercent: 0.65, price: 112.40 },
      { ticker: 'V', name: 'Visa Inc', marketCap: 560, changePercent: 0.45, price: 281.50 },
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    weight: 11.8,
    changePercent: -0.45,
    marketCapText: '$5.2T',
    topStock: { ticker: 'LLY', changePercent: 0.88 },
    stocks: [
      { ticker: 'LLY', name: 'Eli Lilly & Co', marketCap: 840, changePercent: 0.88, price: 924.50 },
      { ticker: 'UNH', name: 'UnitedHealth Group', marketCap: 540, changePercent: -1.85, price: 586.20 },
      { ticker: 'JNJ', name: 'Johnson & Johnson', marketCap: 390, changePercent: -0.32, price: 161.40 },
      { ticker: 'ABBV', name: 'AbbVie Inc', marketCap: 340, changePercent: 0.25, price: 191.10 },
      { ticker: 'MRK', name: 'Merck & Co', marketCap: 280, changePercent: -0.95, price: 110.30 },
      { ticker: 'PFE', name: 'Pfizer Inc', marketCap: 165, changePercent: -0.60, price: 28.95 },
    ]
  },
  {
    id: 'consumer_cyclical',
    name: 'Consumer Discretionary',
    weight: 10.2,
    changePercent: 0.42,
    marketCapText: '$4.5T',
    topStock: { ticker: 'AMZN', changePercent: 1.16 },
    stocks: [
      { ticker: 'AMZN', name: 'Amazon.com Inc', marketCap: 1960, changePercent: 1.16, price: 187.90 },
      { ticker: 'TSLA', name: 'Tesla Inc', marketCap: 704, changePercent: -1.91, price: 220.70 },
      { ticker: 'HD', name: 'Home Depot', marketCap: 410, changePercent: 0.75, price: 412.30 },
      { ticker: 'MCD', name: 'McDonalds Corp', marketCap: 220, changePercent: 0.35, price: 304.80 },
      { ticker: 'NKE', name: 'Nike Inc', marketCap: 125, changePercent: -0.80, price: 82.50 },
    ]
  },
  {
    id: 'communication',
    name: 'Communication Services',
    weight: 8.9,
    changePercent: 1.28,
    marketCapText: '$3.9T',
    topStock: { ticker: 'META', changePercent: 1.50 },
    stocks: [
      { ticker: 'META', name: 'Meta Platforms', marketCap: 1490, changePercent: 1.50, price: 589.34 },
      { ticker: 'GOOGL', name: 'Alphabet Inc', marketCap: 2050, changePercent: 0.89, price: 165.20 },
      { ticker: 'NFLX', name: 'Netflix Inc', marketCap: 310, changePercent: 2.10, price: 715.40 },
      { ticker: 'DIS', name: 'Walt Disney Co', marketCap: 175, changePercent: 0.30, price: 96.20 },
    ]
  },
  {
    id: 'industrials',
    name: 'Industrials',
    weight: 8.4,
    changePercent: 0.65,
    marketCapText: '$3.7T',
    topStock: { ticker: 'CAT', changePercent: 1.40 },
    stocks: [
      { ticker: 'CAT', name: 'Caterpillar Inc', marketCap: 195, changePercent: 1.40, price: 395.20 },
      { ticker: 'GE', name: 'GE Aerospace', marketCap: 205, changePercent: 1.10, price: 188.50 },
      { ticker: 'HON', name: 'Honeywell Int', marketCap: 140, changePercent: 0.45, price: 215.10 },
      { ticker: 'UNP', name: 'Union Pacific', marketCap: 145, changePercent: 0.20, price: 242.00 },
      { ticker: 'BA', name: 'Boeing Co', marketCap: 95, changePercent: -2.40, price: 152.30 },
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    weight: 3.7,
    changePercent: -1.35,
    marketCapText: '$1.6T',
    topStock: { ticker: 'XOM', changePercent: -1.15 },
    stocks: [
      { ticker: 'XOM', name: 'Exxon Mobil Corp', marketCap: 540, changePercent: -1.15, price: 122.40 },
      { ticker: 'CVX', name: 'Chevron Corp', marketCap: 280, changePercent: -1.45, price: 150.80 },
      { ticker: 'COP', name: 'ConocoPhillips', marketCap: 130, changePercent: -1.80, price: 108.20 },
      { ticker: 'SLB', name: 'SLB (Schlumberger)', marketCap: 62, changePercent: -2.10, price: 44.10 },
    ]
  }
];

export const CRYPTO_TREEMAP_DATA = [
  { ticker: 'BTC', name: 'Bitcoin', marketCap: 1330, changePercent: 2.81, price: 67420 },
  { ticker: 'ETH', name: 'Ethereum', marketCap: 317, changePercent: 2.92, price: 2635 },
  { ticker: 'BNB', name: 'BNB', marketCap: 86.4, changePercent: 1.44, price: 592 },
  { ticker: 'SOL', name: 'Solana', marketCap: 72.8, changePercent: 5.38, price: 154.8 },
  { ticker: 'XRP', name: 'XRP', marketCap: 30.8, changePercent: 2.26, price: 0.542 },
  { ticker: 'DOGE', name: 'Dogecoin', marketCap: 20.5, changePercent: 4.12, price: 0.141 },
  { ticker: 'ADA', name: 'Cardano', marketCap: 12.8, changePercent: 1.15, price: 0.358 },
  { ticker: 'AVAX', name: 'Avalanche', marketCap: 11.4, changePercent: 3.75, price: 28.40 },
  { ticker: 'SUI', name: 'Sui', marketCap: 5.6, changePercent: 8.90, price: 2.05 },
  { ticker: 'NEAR', name: 'NEAR Protocol', marketCap: 5.4, changePercent: 4.60, price: 4.95 },
  { ticker: 'LINK', name: 'Chainlink', marketCap: 7.2, changePercent: 1.85, price: 11.60 },
  { ticker: 'SHIB', name: 'Shiba Inu', marketCap: 10.9, changePercent: 2.10, price: 0.0000185 }
];
