import React from 'react';
import { MarketCategory, SymbolQuote } from '../types';
import { InteractiveChart } from './InteractiveChart';
import { TechnicalGauge } from './TechnicalGauge';
import { KeyStatsPanel } from './KeyStatsPanel';
import { MarketMoversTable } from './MarketMoversTable';
import { SymbolLogo } from './SymbolLogo';
import { Flame, Coins, ArrowLeftRight, TrendingUp, Landmark, ShieldAlert, Award } from 'lucide-react';

interface AssetClassOverviewProps {
  category: MarketCategory;
  symbols: SymbolQuote[];
  selectedSymbol: SymbolQuote;
  onSelectSymbol: (ticker: string) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  onOpenChartModal: (ticker: string) => void;
  onOpenTradeModal: (ticker: string) => void;
  isDark: boolean;
}

export const AssetClassOverview: React.FC<AssetClassOverviewProps> = ({
  category,
  symbols,
  selectedSymbol,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  onOpenChartModal,
  onOpenTradeModal,
  isDark,
}) => {
  // Category-specific symbols
  const categorySymbols = symbols.filter(s => {
    if (category === 'indices') return s.category === 'index';
    if (category === 'stocks') return s.category === 'stock';
    if (category === 'crypto') return s.category === 'crypto';
    if (category === 'forex') return s.category === 'forex';
    if (category === 'futures') return s.category === 'future';
    if (category === 'bonds') return s.category === 'bond';
    return true;
  });

  // Render category macro stats banner
  const renderMacroBanner = () => {
    switch (category) {
      case 'crypto':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Total Crypto Market Cap</div>
              <div className="font-mono font-bold text-sm text-white mt-0.5">$2.68 Trillion</div>
              <div className="text-[10px] text-[#089981] font-semibold mt-0.5">+2.4% past 24h</div>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">24h Trading Volume</div>
              <div className="font-mono font-bold text-sm text-white mt-0.5">$94.20 Billion</div>
              <div className="text-[10px] text-[#089981] font-semibold mt-0.5">+14.2% activity</div>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Bitcoin Dominance</div>
              <div className="font-mono font-bold text-sm text-white mt-0.5">56.8%</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">ETH Dominance: 13.9%</div>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Fear & Greed Index</div>
              <div className="font-mono font-bold text-sm text-[#089981] mt-0.5">74 · Greed</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Last week: 68 (Greed)</div>
            </div>
          </div>
        );

      case 'forex':
        return (
          <div className={`p-4 rounded-lg border mb-6 ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Currency Strength Meter (Daily Relative Performance)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 font-mono text-xs tabular-nums">
              {[
                { curr: 'USD', val: '+0.54%', strong: true },
                { curr: 'JPY', val: '+0.38%', strong: true },
                { curr: 'GBP', val: '+0.12%', strong: true },
                { curr: 'AUD', val: '+0.05%', strong: true },
                { curr: 'CAD', val: '-0.14%', strong: false },
                { curr: 'CHF', val: '-0.22%', strong: false },
                { curr: 'EUR', val: '-0.46%', strong: false },
              ].map(c => (
                <div
                  key={c.curr}
                  className={`p-2 rounded text-center border ${
                    isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
                  }`}
                >
                  <div className="font-bold text-white">{c.curr}</div>
                  <div className={`text-[11px] font-semibold mt-0.5 ${c.strong ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {c.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'indices':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Market Breadth (Advancers / Decliners)</div>
              <div className="font-mono font-bold text-sm text-[#089981] mt-0.5">342 Adv / 158 Dec</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">68% of S&P components trading positive</div>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">CBOE Volatility Index (VIX)</div>
              <div className="font-mono font-bold text-sm text-neutral-200 mt-0.5">18.24 (-0.68)</div>
              <div className="text-[10px] text-[#089981] font-semibold mt-0.5">Subdued equity risk premium</div>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Global Equities Sentiment</div>
              <div className="font-mono font-bold text-sm text-[#2962ff] mt-0.5">Bullish Expansion</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">US, German DAX, and Nikkei leading gains</div>
            </div>
          </div>
        );

      case 'futures':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Precious Metals Rally</div>
              <div className="font-mono font-bold text-sm text-amber-400 mt-0.5">Gold $2,662.40 / Silver $31.85</div>
              <div className="text-[10px] text-[#089981] font-semibold mt-0.5">Record highs driven by rate cuts</div>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Energy Complex</div>
              <div className="font-mono font-bold text-sm text-neutral-200 mt-0.5">WTI Crude $70.85 (-1.73%)</div>
              <div className="text-[10px] text-[#f23645] font-semibold mt-0.5">Downward pressure from supply easing</div>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'}`}>
              <div className="text-[11px] text-neutral-400">Commodity Curve Structure</div>
              <div className="font-mono font-bold text-sm text-[#089981] mt-0.5">Backwardation</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Tight front-month physical delivery</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Macro Banner */}
      {renderMacroBanner()}

      {/* Featured Chart & Gauges for Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart (2 cols) */}
        <div className="lg:col-span-2">
          <InteractiveChart
            ticker={selectedSymbol.ticker}
            name={selectedSymbol.name}
            price={selectedSymbol.price}
            change={selectedSymbol.change}
            changePercent={selectedSymbol.changePercent}
            history={selectedSymbol.history}
            isDark={isDark}
            onOpenModal={() => onOpenChartModal(selectedSymbol.ticker)}
            height={380}
          />
        </div>

        {/* Right side stats & Technical Gauge (1 col) */}
        <div className="space-y-4">
          <TechnicalGauge
            rating={selectedSymbol.technicalRating}
            oscillators={selectedSymbol.oscillators}
            movingAverages={selectedSymbol.movingAverages}
            isDark={isDark}
          />

          <KeyStatsPanel
            symbol={selectedSymbol}
            isDark={isDark}
            isInWatchlist={watchlist.includes(selectedSymbol.ticker)}
            onToggleWatchlist={onToggleWatchlist}
            onOpenTradeModal={onOpenTradeModal}
            onOpenAlertModal={() => {}}
            onOpenChartModal={() => onOpenChartModal(selectedSymbol.ticker)}
          />
        </div>
      </div>

      {/* Category Table */}
      <MarketMoversTable
        symbols={categorySymbols.length > 0 ? categorySymbols : symbols}
        selectedTicker={selectedSymbol.ticker}
        onSelectSymbol={onSelectSymbol}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        onOpenChartModal={onOpenChartModal}
        isDark={isDark}
        title={`${category.charAt(0).toUpperCase() + category.slice(1)} Quotes`}
      />
    </div>
  );
};
