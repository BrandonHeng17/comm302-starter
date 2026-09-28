import React from 'react';
import { MarketCategory } from '../types';
import { Search, Bookmark, Sun, Moon, Radio, TrendingUp } from 'lucide-react';

interface NavbarProps {
  activeCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  watchlistCount: number;
  isWatchlistOpen: boolean;
  onToggleWatchlist: () => void;
  isLiveUpdating: boolean;
  onToggleLiveUpdate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  isDark,
  onToggleTheme,
  onOpenSearch,
  watchlistCount,
  isWatchlistOpen,
  onToggleWatchlist,
  isLiveUpdating,
  onToggleLiveUpdate,
}) => {
  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        isDark
          ? 'bg-[#131722]/95 border-[#2a2e39] text-[#d1d4dc] backdrop-blur-md'
          : 'bg-[#ffffff]/95 border-[#e0e3eb] text-[#131722] backdrop-blur-md'
      }`}
    >
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectCategory('overview')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none group"
          >
            {/* Iconic TradingView geometric mark */}
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center shadow-sm group-hover:bg-[#1e53e5] transition-colors">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-4 bg-white rounded-xs"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-3 bg-white rounded-xs"></div>
              </div>
            </div>
            <span
              className={`text-lg font-bold tracking-tight font-sans ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              TradingView
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectCategory('overview')}
            className={`transition-colors py-1 ${
              activeCategory === 'overview'
                ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Markets
          </button>
          <button
            onClick={() => onSelectCategory('screener')}
            className={`transition-colors py-1 ${
              activeCategory === 'screener'
                ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Screeners
          </button>
          <button
            onClick={() => onSelectCategory('heatmap')}
            className={`transition-colors py-1 ${
              activeCategory === 'heatmap'
                ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Heatmaps
          </button>
          <button
            onClick={() => onSelectCategory('calendar')}
            className={`transition-colors py-1 ${
              activeCategory === 'calendar'
                ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
                : isDark
                ? 'text-[#787b86] hover:text-[#d1d4dc]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Calendar
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Tool Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal Search Trigger */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-normal border transition-colors ${
              isDark
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] hover:border-[#363a45]'
                : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-500 hover:text-neutral-800'
            }`}
            title="Search markets (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search markets, tickers...</span>
            <kbd
              className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded ${
                isDark ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              ⌘K
            </kbd>
          </button>

          {/* Live Tick Pulse Toggle */}
          <button
            onClick={onToggleLiveUpdate}
            title={isLiveUpdating ? 'Pause live market feed' : 'Resume live market feed'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isLiveUpdating
                ? isDark
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : isDark
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'
                : 'bg-neutral-100 border-neutral-200 text-neutral-500'
            }`}
          >
            <Radio
              className={`w-3.5 h-3.5 ${
                isLiveUpdating ? 'text-emerald-500 animate-pulse' : 'text-neutral-400'
              }`}
            />
            <span className="hidden lg:inline">{isLiveUpdating ? 'Live Ticks' : 'Paused'}</span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={onToggleWatchlist}
            className={`relative p-2 rounded-lg border transition-colors ${
              isWatchlistOpen
                ? isDark
                  ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                  : 'bg-[#2962ff]/10 border-[#2962ff] text-[#2962ff]'
                : isDark
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc] hover:border-[#363a45]'
                : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-700 hover:border-neutral-300'
            }`}
            title="Toggle Watchlist & Paper Trading panel"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc] hover:text-white'
                : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-700 hover:text-black'
            }`}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User profile avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer select-none ${
              isDark ? 'bg-[#2a2e39] text-white ring-1 ring-[#363a45]' : 'bg-neutral-200 text-neutral-800'
            }`}
            title="User Account"
          >
            BH
          </div>
        </div>
      </div>
    </header>
  );
};
