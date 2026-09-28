import React, { useState, useEffect, useRef } from 'react';
import { SymbolQuote } from '../types';
import { SymbolLogo } from './SymbolLogo';
import { Search, X, TrendingUp, Bookmark } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: SymbolQuote[];
  onSelectSymbol: (ticker: string) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  isDark: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If parent supports opening, it can trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = symbols.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (!query) return true;
    return (
      s.ticker.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.exchange.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all animate-in fade-in zoom-in-95 duration-150 ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-[#ffffff] border-[#e0e3eb] text-[#131722]'
        }`}
      >
        {/* Search Input Box */}
        <div className={`p-4 border-b flex items-center gap-3 ${isDark ? 'border-[#2a2e39]' : 'border-[#e0e3eb]'}`}>
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search symbol, currency, or company name..."
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div
          className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-xs ${
            isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
          }`}
        >
          {['all', 'stock', 'crypto', 'index', 'forex', 'future', 'bond'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : isDark
                  ? 'text-[#787b86] hover:text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No matching financial instruments found for "{query}".
            </div>
          ) : (
            filtered.map(s => {
              const isUp = s.change >= 0;
              const isInWatch = watchlist.includes(s.ticker);

              return (
                <div
                  key={s.ticker}
                  onClick={() => {
                    onSelectSymbol(s.ticker);
                    onClose();
                  }}
                  className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-[#252936]' : 'hover:bg-[#f8f9fd]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SymbolLogo ticker={s.ticker} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{s.ticker}</span>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{s.exchange}</span>
                      </div>
                      <div className="text-xs text-neutral-400">{s.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono tabular-nums">
                      <div className="font-semibold text-xs text-white">
                        {s.price >= 1000 ? s.price.toFixed(1) : s.price.toFixed(2)}
                      </div>
                      <div className={`text-[10px] ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{s.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleWatchlist(s.ticker);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        isInWatch ? 'text-[#2962ff]' : 'text-neutral-500 hover:text-white'
                      }`}
                      title="Pin to Watchlist"
                    >
                      <Bookmark className={`w-4 h-4 ${isInWatch ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
