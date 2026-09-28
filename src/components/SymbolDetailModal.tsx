import React from 'react';
import { SymbolQuote } from '../types';
import { SymbolLogo } from './SymbolLogo';
import { InteractiveChart } from './InteractiveChart';
import { TechnicalGauge } from './TechnicalGauge';
import { KeyStatsPanel } from './KeyStatsPanel';
import { MARKET_NEWS } from '../data/news';
import { X, ExternalLink, Bookmark, ShoppingBag, TrendingUp, Newspaper } from 'lucide-react';

interface SymbolDetailModalProps {
  symbol: SymbolQuote | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: (ticker: string) => void;
  onOpenTradeModal: (ticker: string) => void;
}

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  symbol,
  isOpen,
  onClose,
  isDark,
  isInWatchlist,
  onToggleWatchlist,
  onOpenTradeModal,
}) => {
  if (!isOpen || !symbol) return null;

  const isUp = symbol.change >= 0;
  const relatedNews = MARKET_NEWS.filter(n => n.symbol === symbol.ticker || n.category === symbol.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        className={`w-full max-w-6xl max-h-[92vh] rounded-xl border shadow-2xl flex flex-col overflow-hidden my-auto transition-all ${
          isDark ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]' : 'bg-[#ffffff] border-[#e0e3eb] text-[#131722]'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`p-4 border-b flex items-center justify-between gap-4 ${
            isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
          }`}
        >
          <div className="flex items-center gap-3">
            <SymbolLogo ticker={symbol.ticker} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-sans text-white tracking-tight">
                  {symbol.ticker}
                </h1>
                <span className="text-xs text-neutral-400 uppercase font-mono">
                  {symbol.exchange} · {symbol.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                  Market Open
                </span>
              </div>
              <div className="text-xs text-neutral-400">{symbol.name}</div>
            </div>
          </div>

          {/* Price & Change */}
          <div className="flex items-center gap-6">
            <div className="text-right font-mono tabular-nums">
              <div className="text-xl font-black text-white">
                {symbol.price >= 1000
                  ? symbol.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : symbol.price >= 1
                  ? symbol.price.toFixed(2)
                  : symbol.price.toFixed(4)}
              </div>
              <div className={`text-xs font-semibold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isUp ? '+' : ''}{symbol.change.toFixed(2)} ({isUp ? '+' : ''}{symbol.changePercent.toFixed(2)}%)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenTradeModal(symbol.ticker)}
                className="px-3.5 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Paper Trade
              </button>
              <button
                onClick={() => onToggleWatchlist(symbol.ticker)}
                className={`p-2 rounded-lg border transition-colors ${
                  isInWatchlist
                    ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                    : isDark
                    ? 'bg-[#1e222d] border-[#2a2e39] text-neutral-400 hover:text-white'
                    : 'bg-white border-[#e0e3eb] text-neutral-600 hover:text-black'
                }`}
                title="Watchlist"
              >
                <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main Candlestick Chart */}
          <InteractiveChart
            ticker={symbol.ticker}
            name={symbol.name}
            price={symbol.price}
            change={symbol.change}
            changePercent={symbol.changePercent}
            history={symbol.history}
            isDark={isDark}
            height={440}
          />

          {/* Two-column sub-grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Technical Gauge */}
            <div className="lg:col-span-1">
              <TechnicalGauge
                rating={symbol.technicalRating}
                oscillators={symbol.oscillators}
                movingAverages={symbol.movingAverages}
                isDark={isDark}
              />
            </div>

            {/* Key Statistics */}
            <div className="lg:col-span-2">
              <KeyStatsPanel
                symbol={symbol}
                isDark={isDark}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={onToggleWatchlist}
                onOpenTradeModal={onOpenTradeModal}
                onOpenAlertModal={() => {}}
                onOpenChartModal={() => {}}
              />
            </div>
          </div>

          {/* Simulated Order Book Depth & Recent News */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Book Depth */}
            <div
              className={`p-4 rounded-lg border transition-colors ${
                isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Simulated Level 2 Order Book Depth
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono">Real-time Quotes</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono tabular-nums">
                {/* Bids */}
                <div>
                  <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                    <span>Bid Size</span>
                    <span>Bid Price</span>
                  </div>
                  {[0.05, 0.12, 0.25, 0.40, 0.65].map((delta, i) => (
                    <div key={`bid-${i}`} className="flex justify-between py-1 relative">
                      <div
                        className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 rounded-xs"
                        style={{ width: `${(5 - i) * 18}%` }}
                      />
                      <span className="text-neutral-400 z-10">{((5 - i) * 1400 + 350).toLocaleString()}</span>
                      <span className="text-[#089981] font-bold z-10">
                        {(symbol.price - delta).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Asks */}
                <div>
                  <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                    <span>Ask Price</span>
                    <span>Ask Size</span>
                  </div>
                  {[0.05, 0.12, 0.25, 0.40, 0.65].map((delta, i) => (
                    <div key={`ask-${i}`} className="flex justify-between py-1 relative">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#f23645]/15 rounded-xs"
                        style={{ width: `${(i + 1) * 18}%` }}
                      />
                      <span className="text-[#f23645] font-bold z-10">
                        {(symbol.price + delta).toFixed(2)}
                      </span>
                      <span className="text-neutral-400 z-10">{((i + 1) * 1250 + 400).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related News */}
            <div
              className={`p-4 rounded-lg border transition-colors ${
                isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="w-4 h-4 text-[#2962ff]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Related Market Headlines
                </h3>
              </div>

              <div className="space-y-3">
                {relatedNews.slice(0, 3).map(item => (
                  <div key={item.id} className="text-xs group cursor-pointer">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mb-0.5">
                      <span className="font-semibold text-neutral-300">{item.source}</span>
                      <span>·</span>
                      <span>{item.timeAgo}</span>
                    </div>
                    <div className="text-white group-hover:text-[#2962ff] transition-colors font-medium line-clamp-2">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
