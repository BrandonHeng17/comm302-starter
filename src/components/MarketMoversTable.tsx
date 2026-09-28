import React, { useState } from 'react';
import { SymbolQuote } from '../types';
import { SymbolLogo } from './SymbolLogo';
import { Bookmark, ExternalLink, ArrowUpDown } from 'lucide-react';

interface MarketMoversTableProps {
  symbols: SymbolQuote[];
  selectedTicker: string;
  onSelectSymbol: (ticker: string) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  onOpenChartModal: (ticker: string) => void;
  isDark: boolean;
  title?: string;
  defaultFilter?: 'active' | 'gainers' | 'losers' | 'ath' | 'surge';
}

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  symbols,
  selectedTicker,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  onOpenChartModal,
  isDark,
  title = 'Market Movers',
  defaultFilter = 'active',
}) => {
  const [tab, setTab] = useState<'active' | 'gainers' | 'losers' | 'ath' | 'surge'>(defaultFilter);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'stock' | 'crypto' | 'index' | 'forex' | 'future'>('all');

  // Filter symbols based on tab and category
  const filteredSymbols = symbols
    .filter(s => categoryFilter === 'all' || s.category === categoryFilter)
    .sort((a, b) => {
      switch (tab) {
        case 'active':
          return b.volume - a.volume;
        case 'gainers':
          return b.changePercent - a.changePercent;
        case 'losers':
          return a.changePercent - b.changePercent;
        case 'ath':
          // Closest to 52W high
          const aRatio = a.price / a.fiftyTwoWeekHigh;
          const bRatio = b.price / b.fiftyTwoWeekHigh;
          return bRatio - aRatio;
        case 'surge':
          return b.changePercent * b.volume - a.changePercent * a.volume;
        default:
          return 0;
      }
    })
    .slice(0, 10);

  return (
    <div
      className={`rounded-lg border overflow-hidden transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      {/* Header and Filter Tabs */}
      <div
        className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-[#2a2e39]' : 'border-[#e0e3eb]'
        }`}
      >
        <div className="flex items-center gap-3">
          <h2 className={`font-semibold text-sm tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {title}
          </h2>

          {/* Asset Category Filter */}
          <div className="flex items-center gap-1 text-[11px]">
            {(['all', 'stock', 'crypto', 'index', 'forex', 'future'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded capitalize transition-colors ${
                  categoryFilter === cat
                    ? isDark
                      ? 'bg-[#2a2e39] text-white font-medium'
                      : 'bg-neutral-200 text-black font-medium'
                    : isDark
                    ? 'text-[#787b86] hover:text-[#d1d4dc]'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Buttons (Most Active, Top Gainers, etc.) */}
        <div
          className={`flex items-center p-0.5 rounded border text-xs font-medium ${
            isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#f0f3fa] border-[#e0e3eb]'
          }`}
        >
          <button
            onClick={() => setTab('active')}
            className={`px-2.5 py-1 rounded transition-colors ${
              tab === 'active'
                ? 'bg-[#2962ff] text-white shadow-xs'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Most Active
          </button>
          <button
            onClick={() => setTab('gainers')}
            className={`px-2.5 py-1 rounded transition-colors ${
              tab === 'gainers'
                ? 'bg-[#2962ff] text-white shadow-xs'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setTab('losers')}
            className={`px-2.5 py-1 rounded transition-colors ${
              tab === 'losers'
                ? 'bg-[#2962ff] text-white shadow-xs'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Top Losers
          </button>
          <button
            onClick={() => setTab('ath')}
            className={`px-2.5 py-1 rounded transition-colors ${
              tab === 'ath'
                ? 'bg-[#2962ff] text-white shadow-xs'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Near ATH
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className={`border-b text-[11px] font-medium ${
                isDark ? 'bg-[#181b24] border-[#2a2e39] text-[#787b86]' : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-500'
              }`}
            >
              <th className="py-2.5 px-4 font-normal">Symbol</th>
              <th className="py-2.5 px-4 font-normal text-right">Price</th>
              <th className="py-2.5 px-4 font-normal text-right">Change</th>
              <th className="py-2.5 px-4 font-normal text-right">% Change</th>
              <th className="py-2.5 px-4 font-normal text-right hidden sm:table-cell">Volume</th>
              <th className="py-2.5 px-4 font-normal text-right hidden md:table-cell">Market Cap</th>
              <th className="py-2.5 px-4 font-normal text-center hidden lg:table-cell">Rating</th>
              <th className="py-2.5 px-4 font-normal text-center hidden xl:table-cell">Trend (7D)</th>
              <th className="py-2.5 px-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-[#2a2e39]' : 'divide-[#e0e3eb]'}`}>
            {filteredSymbols.map(sym => {
              const isUp = sym.change >= 0;
              const isSelected = selectedTicker === sym.ticker;
              const isInWatch = watchlist.includes(sym.ticker);

              return (
                <tr
                  key={sym.ticker}
                  onClick={() => onSelectSymbol(sym.ticker)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? isDark
                        ? 'bg-[#2a2e39]/80'
                        : 'bg-[#f0f3fa]'
                      : isDark
                      ? 'hover:bg-[#252936]'
                      : 'hover:bg-[#f8f9fd]'
                  }`}
                >
                  {/* Symbol & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <SymbolLogo ticker={sym.ticker} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold font-sans text-xs">
                          <span className={isDark ? 'text-white' : 'text-neutral-900'}>
                            {sym.ticker}
                          </span>
                          <span className="text-[10px] font-normal text-neutral-400">
                            {sym.exchange}
                          </span>
                        </div>
                        <div className={`text-[11px] truncate max-w-[140px] sm:max-w-[200px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                          {sym.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-mono font-medium tabular-nums">
                    <span className={isDark ? 'text-[#d1d4dc]' : 'text-neutral-900'}>
                      {sym.price >= 1000
                        ? sym.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : sym.price >= 1
                        ? sym.price.toFixed(2)
                        : sym.price.toFixed(4)}
                    </span>
                  </td>

                  {/* Change $ */}
                  <td
                    className={`py-3 px-4 text-right font-mono tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {Math.abs(sym.change) >= 1 ? sym.change.toFixed(2) : sym.change.toFixed(4)}
                  </td>

                  {/* Change % */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        isUp
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : 'bg-[#f23645]/15 text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {sym.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums hidden sm:table-cell text-neutral-400">
                    {sym.volumeText || (sym.volume > 0 ? (sym.volume / 1e6).toFixed(1) + 'M' : '—')}
                  </td>

                  {/* Market Cap */}
                  <td className="py-3 px-4 text-right font-mono tabular-nums hidden md:table-cell text-neutral-400">
                    {sym.marketCapText || '—'}
                  </td>

                  {/* Technical Rating */}
                  <td className="py-3 px-4 text-center hidden lg:table-cell">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        sym.technicalRating === 'Strong Buy'
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : sym.technicalRating === 'Buy'
                          ? 'bg-[#22ab94]/15 text-[#22ab94]'
                          : sym.technicalRating === 'Neutral'
                          ? 'bg-neutral-500/15 text-neutral-400'
                          : sym.technicalRating === 'Sell'
                          ? 'bg-[#f7525f]/15 text-[#f7525f]'
                          : 'bg-[#f23645]/15 text-[#f23645]'
                      }`}
                    >
                      {sym.technicalRating}
                    </span>
                  </td>

                  {/* 7D Trend Sparkline */}
                  <td className="py-3 px-4 text-center hidden xl:table-cell">
                    <div className="w-20 h-6 mx-auto">
                      {sym.sparkline.length > 2 && (
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
                          {(() => {
                            const min = Math.min(...sym.sparkline);
                            const max = Math.max(...sym.sparkline);
                            const range = max - min || 1;
                            const points = sym.sparkline
                              .map((val, idx) => {
                                const x = (idx / (sym.sparkline.length - 1)) * 60;
                                const y = 18 - ((val - min) / range) * 16;
                                return `${x.toFixed(1)},${y.toFixed(1)}`;
                              })
                              .join(' ');
                            return (
                              <polyline
                                fill="none"
                                stroke={isUp ? '#089981' : '#f23645'}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={points}
                              />
                            );
                          })()}
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleWatchlist(sym.ticker)}
                        className={`p-1.5 rounded transition-colors ${
                          isInWatch
                            ? 'text-[#2962ff] bg-[#2962ff]/10'
                            : isDark
                            ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                            : 'text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100'
                        }`}
                        title={isInWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isInWatch ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => onOpenChartModal(sym.ticker)}
                        className={`p-1.5 rounded transition-colors ${
                          isDark
                            ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                            : 'text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100'
                        }`}
                        title="Open Chart"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
