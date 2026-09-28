import React, { useState, useEffect, useCallback } from 'react';
import {
  MarketCategory,
  SymbolQuote,
  UserPortfolio,
  PaperTradeOrder,
} from './types';
import { INITIAL_SYMBOLS } from './data/marketData';
import { MARKET_NEWS } from './data/news';
import { TopTickerTape } from './components/TopTickerTape';
import { Navbar } from './components/Navbar';
import { MarketsSubnav } from './components/MarketsSubnav';
import { InteractiveChart } from './components/InteractiveChart';
import { TechnicalGauge } from './components/TechnicalGauge';
import { KeyStatsPanel } from './components/KeyStatsPanel';
import { MarketMoversTable } from './components/MarketMoversTable';
import { HeatmapView } from './components/HeatmapView';
import { ScreenerView } from './components/ScreenerView';
import { YieldCurveChart } from './components/YieldCurveChart';
import { EconomicCalendarView } from './components/EconomicCalendarView';
import { AssetClassOverview } from './components/AssetClassOverview';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { SearchModal } from './components/SearchModal';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { SymbolLogo } from './components/SymbolLogo';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Newspaper,
  Flame,
  Globe2,
  Sliders,
  DollarSign,
  Activity,
  BarChart3,
  CheckCircle2,
  BellRing,
} from 'lucide-react';

export default function App() {
  // Theme state: dark mode matches iconic TradingView default
  const [isDark, setIsDark] = useState<boolean>(true);

  // Market Data state
  const [symbols, setSymbols] = useState<SymbolQuote[]>(INITIAL_SYMBOLS);
  const [selectedTicker, setSelectedTicker] = useState<string>('SPX');
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('overview');

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>([
    'SPX',
    'NVDA',
    'BTCUSD',
    'AAPL',
    'GC1!',
    'EURUSD',
  ]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [detailTicker, setDetailTicker] = useState<string>('SPX');

  // Simulated Live Market Feeds
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);

  // Paper Trading Portfolio state
  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    cash: 100000.0,
    equity: 100000.0,
    positions: [
      { ticker: 'NVDA', shares: 50, avgPrice: 130.5, currentPrice: 138.25 },
      { ticker: 'BTCUSD', shares: 0.25, avgPrice: 64200.0, currentPrice: 67420.0 },
    ],
    orders: [],
  });

  // Price Alerts state
  const [alerts, setAlerts] = useState<
    { id: string; ticker: string; targetPrice: number; condition: 'ABOVE' | 'BELOW' }[]
  >([
    { id: 'alt-1', ticker: 'BTCUSD', targetPrice: 70000, condition: 'ABOVE' },
    { id: 'alt-2', ticker: 'NVDA', targetPrice: 140, condition: 'ABOVE' },
  ]);

  // Active toast notification for alert trigger
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Toggle Theme handler
  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Select Symbol handler
  const handleSelectSymbol = (ticker: string) => {
    setSelectedTicker(ticker);
  };

  // Open Full Chart Modal handler
  const handleOpenChartModal = (ticker?: string) => {
    setDetailTicker(ticker || selectedTicker);
    setIsDetailModalOpen(true);
  };

  // Toggle symbol in Watchlist
  const handleToggleWatchlist = (ticker: string) => {
    setWatchlist(prev =>
      prev.includes(ticker) ? prev.filter(t => t !== ticker) : [...prev, ticker]
    );
  };

  // Execute Paper Trade
  const handleExecuteTrade = (ticker: string, type: 'BUY' | 'SELL', shares: number) => {
    const symbol = symbols.find(s => s.ticker === ticker);
    if (!symbol) return;

    const totalCost = shares * symbol.price;

    setPortfolio(prev => {
      let newCash = prev.cash;
      let newPositions = [...prev.positions];

      if (type === 'BUY') {
        if (newCash < totalCost) return prev; // insufficient funds
        newCash -= totalCost;
        const existingIdx = newPositions.findIndex(p => p.ticker === ticker);
        if (existingIdx >= 0) {
          const old = newPositions[existingIdx];
          const newShares = old.shares + shares;
          const newAvg = (old.shares * old.avgPrice + totalCost) / newShares;
          newPositions[existingIdx] = {
            ...old,
            shares: newShares,
            avgPrice: newAvg,
            currentPrice: symbol.price,
          };
        } else {
          newPositions.push({
            ticker,
            shares,
            avgPrice: symbol.price,
            currentPrice: symbol.price,
          });
        }
      } else {
        // SELL
        const existingIdx = newPositions.findIndex(p => p.ticker === ticker);
        if (existingIdx < 0) return prev; // no position to sell
        const old = newPositions[existingIdx];
        if (old.shares < shares) return prev; // cannot sell more than held
        newCash += totalCost;
        if (old.shares === shares) {
          newPositions = newPositions.filter(p => p.ticker !== ticker);
        } else {
          newPositions[existingIdx] = {
            ...old,
            shares: old.shares - shares,
            currentPrice: symbol.price,
          };
        }
      }

      const order: PaperTradeOrder = {
        id: `ord-${Date.now()}`,
        ticker,
        type,
        shares,
        price: symbol.price,
        total: totalCost,
        timestamp: Date.now(),
        status: 'FILLED',
      };

      return {
        cash: newCash,
        equity: newCash,
        positions: newPositions,
        orders: [order, ...prev.orders],
      };
    });
  };

  // Add Price Alert
  const handleAddAlert = (ticker: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const newAlert = {
      id: `alt-${Date.now()}`,
      ticker,
      targetPrice,
      condition,
    };
    setAlerts(prev => [...prev, newAlert]);
    setToastNotification(`Alert set: ${ticker} ${condition} $${targetPrice}`);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Remove Alert
  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Live Simulated Market Ticker Loop
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setSymbols(prevSymbols => {
        // Pick 1 to 2 random symbols to tick
        const updated = [...prevSymbols];
        const numUpdates = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < numUpdates; i++) {
          const randIdx = Math.floor(Math.random() * updated.length);
          const sym = { ...updated[randIdx] };

          // Micro delta between -0.15% and +0.15%
          const pctDelta = (Math.random() - 0.49) * 0.003;
          const oldPrice = sym.price;
          const newPrice = Number((oldPrice * (1 + pctDelta)).toFixed(sym.price > 10 ? 2 : 4));
          const diff = newPrice - oldPrice;

          sym.price = newPrice;
          sym.change = Number((sym.change + diff).toFixed(2));
          sym.changePercent = Number(((sym.change / (sym.price - sym.change)) * 100).toFixed(2));
          sym.high24h = Math.max(sym.high24h, newPrice);
          sym.low24h = Math.min(sym.low24h, newPrice);

          // Update last candle in history
          if (sym.history && sym.history.length > 0) {
            const hist = [...sym.history];
            const lastCandle = { ...hist[hist.length - 1] };
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            hist[hist.length - 1] = lastCandle;
            sym.history = hist;
          }

          // Check alerts
          alerts.forEach(alt => {
            if (alt.ticker === sym.ticker) {
              if (alt.condition === 'ABOVE' && newPrice >= alt.targetPrice) {
                setToastNotification(`🔔 Trigger: ${sym.ticker} crossed above $${alt.targetPrice}!`);
                setTimeout(() => setToastNotification(null), 4000);
              } else if (alt.condition === 'BELOW' && newPrice <= alt.targetPrice) {
                setToastNotification(`🔔 Trigger: ${sym.ticker} dropped below $${alt.targetPrice}!`);
                setTimeout(() => setToastNotification(null), 4000);
              }
            }
          });

          updated[randIdx] = sym;
        }

        return updated;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveUpdating, alerts]);

  // Selected symbol quote
  const currentSymbol = symbols.find(s => s.ticker === selectedTicker) || symbols[0];
  const modalSymbol = symbols.find(s => s.ticker === detailTicker) || currentSymbol;

  // Major fast-switch hero symbols
  const heroHighlightTickers = ['SPX', 'NDX', 'BTCUSD', 'NVDA', 'AAPL', 'GC1!', 'EURUSD'];

  return (
    <div
      className={`min-h-screen font-sans transition-colors ${
        isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#ffffff] text-[#131722]'
      }`}
    >
      {/* 1. Continuous Ticker Tape Marquee at very top */}
      <TopTickerTape
        symbols={symbols}
        selectedTicker={selectedTicker}
        onSelectSymbol={handleSelectSymbol}
        isDark={isDark}
      />

      {/* 2. Top Navigation Bar (Strict Top Bar Contract) */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlist.length}
        isWatchlistOpen={isWatchlistOpen}
        onToggleWatchlist={() => setIsWatchlistOpen(prev => !prev)}
        isLiveUpdating={isLiveUpdating}
        onToggleLiveUpdate={() => setIsLiveUpdating(prev => !prev)}
      />

      {/* 3. Sub-Navigation Tabs for Market categories */}
      <MarketsSubnav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isDark={isDark}
      />

      {/* Main Content Area */}
      <main className="max-w-[1560px] mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW (Main TradingView Hub)                                    */}
        {/* ========================================================================= */}
        {activeCategory === 'overview' && (
          <div className="space-y-8">
            {/* Page Header Kicker & Title */}
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight font-sans ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  Markets Overview
                </h1>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                  Global equities, cryptocurrencies, sovereign yield curves, commodities, and macro releases
                </p>
              </div>

              {/* Fast-switch asset tabs */}
              <div
                className={`flex items-center gap-1 p-1 rounded-lg border overflow-x-auto ${
                  isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#f0f3fa] border-[#e0e3eb]'
                }`}
              >
                {heroHighlightTickers.map(ticker => {
                  const sym = symbols.find(s => s.ticker === ticker);
                  if (!sym) return null;
                  const isSelected = selectedTicker === ticker;
                  const isUp = sym.change >= 0;

                  return (
                    <button
                      key={ticker}
                      onClick={() => setSelectedTicker(ticker)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-[#2962ff] text-white shadow-xs'
                          : isDark
                          ? 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
                          : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
                      }`}
                    >
                      <span>{sym.ticker}</span>
                      <span className={`text-[10px] font-mono tabular-nums ${isSelected ? 'text-white' : isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{sym.changePercent.toFixed(1)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HERO SECTION: Interactive Chart + Technical Analysis Gauge + Key Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left / Center 2 Columns: Large Interactive Chart */}
              <div className="lg:col-span-2 space-y-3">
                {/* Active Symbol Header Lockup */}
                <div
                  className={`p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4 transition-colors ${
                    isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SymbolLogo ticker={currentSymbol.ticker} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold font-sans ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {currentSymbol.ticker}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {currentSymbol.exchange}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                          Live Market
                        </span>
                      </div>
                      <div className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                        {currentSymbol.name}
                      </div>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="text-right font-mono tabular-nums">
                    <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {currentSymbol.price >= 1000
                        ? currentSymbol.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : currentSymbol.price >= 1
                        ? currentSymbol.price.toFixed(2)
                        : currentSymbol.price.toFixed(4)}
                    </div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-1.5 ${
                        currentSymbol.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {currentSymbol.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>
                        {currentSymbol.change >= 0 ? '+' : ''}{currentSymbol.change.toFixed(2)} ({currentSymbol.change >= 0 ? '+' : ''}{currentSymbol.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Chart Canvas */}
                <InteractiveChart
                  ticker={currentSymbol.ticker}
                  name={currentSymbol.name}
                  price={currentSymbol.price}
                  change={currentSymbol.change}
                  changePercent={currentSymbol.changePercent}
                  history={currentSymbol.history}
                  isDark={isDark}
                  onOpenModal={() => handleOpenChartModal(currentSymbol.ticker)}
                  height={380}
                />
              </div>

              {/* Right Column: Speedometer Technical Gauge + Key Statistics Panel */}
              <div className="space-y-4">
                <TechnicalGauge
                  rating={currentSymbol.technicalRating}
                  oscillators={currentSymbol.oscillators}
                  movingAverages={currentSymbol.movingAverages}
                  isDark={isDark}
                />

                <KeyStatsPanel
                  symbol={currentSymbol}
                  isDark={isDark}
                  isInWatchlist={watchlist.includes(currentSymbol.ticker)}
                  onToggleWatchlist={handleToggleWatchlist}
                  onOpenTradeModal={ticker => {
                    setSelectedTicker(ticker);
                    setIsWatchlistOpen(true);
                  }}
                  onOpenAlertModal={ticker => {
                    setSelectedTicker(ticker);
                    setIsWatchlistOpen(true);
                  }}
                  onOpenChartModal={() => handleOpenChartModal(currentSymbol.ticker)}
                />
              </div>
            </div>

            {/* SECTOR HEATMAP PREVIEW SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Market Pulse & Sector Treemap
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                    Real-time market capitalization performance matrix
                  </p>
                </div>
                <button
                  onClick={() => setActiveCategory('heatmap')}
                  className="flex items-center gap-1 text-xs font-semibold text-[#2962ff] hover:underline"
                >
                  <span>Explore Full Heatmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <HeatmapView
                onSelectSymbol={ticker => {
                  setSelectedTicker(ticker);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isDark={isDark}
              />
            </div>

            {/* MARKET MOVERS SECTION (Tabs: Most Active, Top Gainers, Top Losers, Near ATH) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Market Movers & Highlights
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                    High-volume equities, cryptocurrency spikes, and macro movers
                  </p>
                </div>
                <button
                  onClick={() => setActiveCategory('screener')}
                  className="flex items-center gap-1 text-xs font-semibold text-[#2962ff] hover:underline"
                >
                  <span>Open Stock Screener</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <MarketMoversTable
                symbols={symbols}
                selectedTicker={selectedTicker}
                onSelectSymbol={handleSelectSymbol}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onOpenChartModal={handleOpenChartModal}
                isDark={isDark}
                title="Global Market Movers"
              />
            </div>

            {/* FINANCIAL NEWS WIRE & GLOBAL BENCHMARKS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* News Feed (2 cols) */}
              <div
                className={`md:col-span-2 p-4 rounded-lg border transition-colors ${
                  isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-[#2962ff]" />
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Live Financial Headlines
                    </h3>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">Real-Time Wire</span>
                </div>

                <div className="divide-y divide-neutral-700/30">
                  {MARKET_NEWS.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSymbol(item.symbol)}
                      className={`py-3 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-[#252936]' : 'hover:bg-[#f8f9fd]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                          <span className="font-bold text-[#2962ff]">{item.source}</span>
                          <span>·</span>
                          <span>{item.timeAgo}</span>
                          <span>·</span>
                          <span className="px-1.5 py-0.2 rounded bg-neutral-700/40 text-neutral-300">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs font-bold text-[#2962ff] px-2 py-1 rounded bg-[#2962ff]/10">
                          {item.symbol}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Market Status Sidebar (1 col) */}
              <div
                className={`p-4 rounded-lg border transition-colors ${
                  isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Globe2 className="w-4 h-4 text-[#2962ff]" />
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Global Exchange Hours
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { exchange: 'New York (NYSE / NASDAQ)', status: 'OPEN', color: 'text-emerald-400', time: '09:30 - 16:00 EST' },
                    { exchange: 'London (LSE)', status: 'OPEN', color: 'text-emerald-400', time: '08:00 - 16:30 GMT' },
                    { exchange: 'Frankfurt (XETRA)', status: 'OPEN', color: 'text-emerald-400', time: '09:00 - 17:30 CET' },
                    { exchange: 'Tokyo (TSE)', status: 'CLOSED', color: 'text-neutral-400', time: '09:00 - 15:00 JST' },
                    { exchange: 'Hong Kong (HKEX)', status: 'CLOSED', color: 'text-neutral-400', time: '09:30 - 16:00 HKT' },
                    { exchange: 'Crypto 24/7 Global', status: 'OPEN 24/7', color: 'text-emerald-400', time: 'Always Active' },
                  ].map(ex => (
                    <div key={ex.exchange} className="p-2 rounded bg-black/15 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{ex.exchange}</div>
                        <div className="text-[10px] text-neutral-400">{ex.time}</div>
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-black/30 ${ex.color}`}>
                        {ex.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INDICES SCREEN                                                     */}
        {/* ========================================================================= */}
        {activeCategory === 'indices' && (
          <AssetClassOverview
            category="indices"
            symbols={symbols}
            selectedSymbol={currentSymbol}
            onSelectSymbol={handleSelectSymbol}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenChartModal={handleOpenChartModal}
            onOpenTradeModal={ticker => {
              setSelectedTicker(ticker);
              setIsWatchlistOpen(true);
            }}
            isDark={isDark}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STOCKS SCREEN                                                      */}
        {/* ========================================================================= */}
        {activeCategory === 'stocks' && (
          <AssetClassOverview
            category="stocks"
            symbols={symbols}
            selectedSymbol={currentSymbol}
            onSelectSymbol={handleSelectSymbol}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenChartModal={handleOpenChartModal}
            onOpenTradeModal={ticker => {
              setSelectedTicker(ticker);
              setIsWatchlistOpen(true);
            }}
            isDark={isDark}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CRYPTO SCREEN                                                      */}
        {/* ========================================================================= */}
        {activeCategory === 'crypto' && (
          <AssetClassOverview
            category="crypto"
            symbols={symbols}
            selectedSymbol={currentSymbol}
            onSelectSymbol={handleSelectSymbol}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenChartModal={handleOpenChartModal}
            onOpenTradeModal={ticker => {
              setSelectedTicker(ticker);
              setIsWatchlistOpen(true);
            }}
            isDark={isDark}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FOREX SCREEN                                                       */}
        {/* ========================================================================= */}
        {activeCategory === 'forex' && (
          <AssetClassOverview
            category="forex"
            symbols={symbols}
            selectedSymbol={currentSymbol}
            onSelectSymbol={handleSelectSymbol}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenChartModal={handleOpenChartModal}
            onOpenTradeModal={ticker => {
              setSelectedTicker(ticker);
              setIsWatchlistOpen(true);
            }}
            isDark={isDark}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 6: FUTURES & COMMODITIES SCREEN                                       */}
        {/* ========================================================================= */}
        {activeCategory === 'futures' && (
          <AssetClassOverview
            category="futures"
            symbols={symbols}
            selectedSymbol={currentSymbol}
            onSelectSymbol={handleSelectSymbol}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenChartModal={handleOpenChartModal}
            onOpenTradeModal={ticker => {
              setSelectedTicker(ticker);
              setIsWatchlistOpen(true);
            }}
            isDark={isDark}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 7: BONDS & RATES (YIELD CURVE) SCREEN                                 */}
        {/* ========================================================================= */}
        {activeCategory === 'bonds' && <YieldCurveChart isDark={isDark} />}

        {/* ========================================================================= */}
        {/* TAB 8: HEATMAP SCREEN                                                     */}
        {/* ========================================================================= */}
        {activeCategory === 'heatmap' && (
          <HeatmapView
            onSelectSymbol={ticker => {
              setSelectedTicker(ticker);
              handleOpenChartModal(ticker);
            }}
            isDark={isDark}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 9: SCREENER SCREEN                                                    */}
        {/* ========================================================================= */}
        {activeCategory === 'screener' && (
          <ScreenerView
            symbols={symbols}
            selectedTicker={selectedTicker}
            onSelectSymbol={handleSelectSymbol}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenChartModal={handleOpenChartModal}
            isDark={isDark}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 10: ECONOMIC CALENDAR SCREEN                                          */}
        {/* ========================================================================= */}
        {activeCategory === 'calendar' && <EconomicCalendarView isDark={isDark} />}
      </main>

      {/* 4. Right-side Watchlist & Paper Trading Sidebar */}
      <WatchlistSidebar
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        symbols={symbols}
        watchlist={watchlist}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectSymbol={ticker => {
          setSelectedTicker(ticker);
        }}
        selectedTicker={selectedTicker}
        portfolio={portfolio}
        onExecuteTrade={handleExecuteTrade}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
        isDark={isDark}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 5. Universal Cmd+K Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={ticker => {
          setSelectedTicker(ticker);
        }}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
        isDark={isDark}
      />

      {/* 6. Symbol Detail / Full Screen Chart Inspection Modal */}
      <SymbolDetailModal
        symbol={modalSymbol}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isDark={isDark}
        isInWatchlist={watchlist.includes(modalSymbol.ticker)}
        onToggleWatchlist={handleToggleWatchlist}
        onOpenTradeModal={ticker => {
          setSelectedTicker(ticker);
          setIsDetailModalOpen(false);
          setIsWatchlistOpen(true);
        }}
      />

      {/* 7. Toast Alerts Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#2962ff] text-white font-medium text-xs rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <BellRing className="w-4 h-4 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`border-t py-8 px-6 mt-12 transition-colors ${
          isDark ? 'bg-[#0f1118] border-[#2a2e39] text-[#787b86]' : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-500'
        }`}
      >
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2962ff] flex items-center justify-center text-white text-[9px] font-black">
              TV
            </div>
            <span className="font-semibold text-white">TradingView Markets Experience</span>
            <span>·</span>
            <span>Live Quotes, Technical Analytics & Global Market Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveCategory('overview')} className="hover:text-white transition-colors">
              Overview
            </button>
            <button onClick={() => setActiveCategory('indices')} className="hover:text-white transition-colors">
              Indices
            </button>
            <button onClick={() => setActiveCategory('stocks')} className="hover:text-white transition-colors">
              Stocks
            </button>
            <button onClick={() => setActiveCategory('crypto')} className="hover:text-white transition-colors">
              Crypto
            </button>
            <button onClick={() => setActiveCategory('forex')} className="hover:text-white transition-colors">
              Forex
            </button>
            <button onClick={() => setActiveCategory('bonds')} className="hover:text-white transition-colors">
              Yield Curve
            </button>
            <button onClick={() => setActiveCategory('calendar')} className="hover:text-white transition-colors">
              Calendar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
