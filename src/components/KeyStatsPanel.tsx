import React from 'react';
import { SymbolQuote } from '../types';
import { Bookmark, Bell, ShoppingBag, ExternalLink } from 'lucide-react';

interface KeyStatsPanelProps {
  symbol: SymbolQuote;
  isDark: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: (ticker: string) => void;
  onOpenTradeModal: (ticker: string) => void;
  onOpenAlertModal: (ticker: string) => void;
  onOpenChartModal: () => void;
}

export const KeyStatsPanel: React.FC<KeyStatsPanelProps> = ({
  symbol,
  isDark,
  isInWatchlist,
  onToggleWatchlist,
  onOpenTradeModal,
  onOpenAlertModal,
  onOpenChartModal,
}) => {
  // 52-week position calculation
  const range52 = symbol.fiftyTwoWeekHigh - symbol.fiftyTwoWeekLow || 1;
  const pct52 = Math.min(100, Math.max(0, ((symbol.price - symbol.fiftyTwoWeekLow) / range52) * 100));

  // Day range position calculation
  const dayRange = symbol.high24h - symbol.low24h || 1;
  const pctDay = Math.min(100, Math.max(0, ((symbol.price - symbol.low24h) / dayRange) * 100));

  return (
    <div
      className={`p-4 rounded-lg border flex flex-col justify-between transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      <div>
        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => onOpenTradeModal(symbol.ticker)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-semibold rounded transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Paper Trade</span>
          </button>

          <button
            onClick={() => onToggleWatchlist(symbol.ticker)}
            className={`p-2 rounded border text-xs font-medium transition-colors ${
              isInWatchlist
                ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                : isDark
                ? 'bg-[#181b24] border-[#2a2e39] text-[#d1d4dc] hover:border-[#363a45]'
                : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-700 hover:border-neutral-300'
            }`}
            title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => onOpenAlertModal(symbol.ticker)}
            className={`p-2 rounded border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-[#181b24] border-[#2a2e39] text-[#d1d4dc] hover:border-[#363a45]'
                : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-700 hover:border-neutral-300'
            }`}
            title="Set Price Alert"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenChartModal}
            className={`p-2 rounded border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-[#181b24] border-[#2a2e39] text-[#d1d4dc] hover:border-[#363a45]'
                : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-700 hover:border-neutral-300'
            }`}
            title="Open Interactive Full Screen Chart"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* 52-Week Range Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className={isDark ? 'text-[#787b86]' : 'text-neutral-500'}>52-Week Range</span>
            <span className="font-mono text-xs tabular-nums text-neutral-300">
              {pct52.toFixed(0)}% of Range
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
            <span className="text-[11px] text-neutral-400">{symbol.fiftyTwoWeekLow.toFixed(2)}</span>
            <div className="flex-1 h-2 bg-[#131722] rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#f23645] via-[#2962ff] to-[#089981] rounded-full"
                style={{ width: '100%' }}
              />
              <div
                className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-md -ml-1"
                style={{ left: `${pct52}%` }}
              />
            </div>
            <span className="text-[11px] text-neutral-400">{symbol.fiftyTwoWeekHigh.toFixed(2)}</span>
          </div>
        </div>

        {/* Day's Range Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className={isDark ? 'text-[#787b86]' : 'text-neutral-500'}>Day Range</span>
            <span className="font-mono text-xs tabular-nums text-neutral-300">
              {pctDay.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
            <span className="text-[11px] text-neutral-400">{symbol.low24h.toFixed(2)}</span>
            <div className="flex-1 h-1.5 bg-[#131722] rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#2962ff] rounded-full"
                style={{ width: `${pctDay}%` }}
              />
            </div>
            <span className="text-[11px] text-neutral-400">{symbol.high24h.toFixed(2)}</span>
          </div>
        </div>

        {/* Key Fundamentals Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-sans border-t pt-3 border-neutral-700/40">
          <div>
            <div className={`text-[11px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>Market Cap</div>
            <div className="font-mono font-semibold tabular-nums mt-0.5">
              {symbol.marketCapText || '—'}
            </div>
          </div>
          <div>
            <div className={`text-[11px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>Volume (24h)</div>
            <div className="font-mono font-semibold tabular-nums mt-0.5">
              {symbol.volumeText || (symbol.volume > 0 ? (symbol.volume / 1e6).toFixed(1) + 'M' : '—')}
            </div>
          </div>
          <div>
            <div className={`text-[11px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>P/E Ratio</div>
            <div className="font-mono font-semibold tabular-nums mt-0.5">
              {symbol.peRatio ? symbol.peRatio.toFixed(1) : '—'}
            </div>
          </div>
          <div>
            <div className={`text-[11px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>EPS (TTM)</div>
            <div className="font-mono font-semibold tabular-nums mt-0.5">
              {symbol.eps ? `$${symbol.eps.toFixed(2)}` : '—'}
            </div>
          </div>
          <div>
            <div className={`text-[11px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>Div Yield</div>
            <div className="font-mono font-semibold tabular-nums mt-0.5">
              {symbol.dividendYield ? `${symbol.dividendYield.toFixed(2)}%` : '0.00%'}
            </div>
          </div>
          <div>
            <div className={`text-[11px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>Beta (5Y)</div>
            <div className="font-mono font-semibold tabular-nums mt-0.5">
              {symbol.beta ? symbol.beta.toFixed(2) : '1.00'}
            </div>
          </div>
        </div>
      </div>

      {/* Description blurb */}
      {symbol.description && (
        <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed line-clamp-3 ${isDark ? 'border-[#2a2e39] text-[#787b86]' : 'border-[#e0e3eb] text-neutral-600'}`}>
          {symbol.description}
        </div>
      )}
    </div>
  );
};
