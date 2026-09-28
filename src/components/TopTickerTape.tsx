import React, { useRef } from 'react';
import { SymbolQuote } from '../types';
import { SymbolLogo } from './SymbolLogo';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TopTickerTapeProps {
  symbols: SymbolQuote[];
  selectedTicker: string;
  onSelectSymbol: (ticker: string) => void;
  isDark: boolean;
}

export const TopTickerTape: React.FC<TopTickerTapeProps> = ({
  symbols,
  selectedTicker,
  onSelectSymbol,
  isDark,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Top highlight symbols for the marquee
  const marqueeTickers = ['SPX', 'NDX', 'DJI', 'BTCUSD', 'NVDA', 'GC1!', 'CL1!', 'EURUSD', 'US10Y', 'DAX', 'NI225'];
  const tapeSymbols = marqueeTickers
    .map(t => symbols.find(s => s.ticker === t))
    .filter((s): s is SymbolQuote => Boolean(s));

  return (
    <div
      className={`relative w-full border-b select-none overflow-hidden transition-colors ${
        isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      {/* Scroll left button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className={`absolute left-0 top-0 bottom-0 z-10 px-1.5 flex items-center justify-center transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-[#131722] via-[#131722]/90 to-transparent text-neutral-400 hover:text-white'
            : 'bg-gradient-to-r from-white via-white/90 to-transparent text-neutral-500 hover:text-black'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Ticker items row */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-6 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tapeSymbols.map(sym => {
          const isUp = sym.change >= 0;
          const isSelected = selectedTicker === sym.ticker;

          return (
            <button
              key={sym.ticker}
              onClick={() => onSelectSymbol(sym.ticker)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded transition-all whitespace-nowrap shrink-0 group ${
                isSelected
                  ? isDark
                    ? 'bg-[#2a2e39] ring-1 ring-[#2962ff]'
                    : 'bg-[#f0f3fa] ring-1 ring-[#2962ff]'
                  : isDark
                  ? 'hover:bg-[#1e222d]'
                  : 'hover:bg-[#f8f9fd]'
              }`}
            >
              <SymbolLogo ticker={sym.ticker} size="sm" />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-semibold text-xs tracking-tight ${
                      isDark ? 'text-[#f0f3fa]' : 'text-[#131722]'
                    }`}
                  >
                    {sym.ticker}
                  </span>
                  <span className={`text-[10px] truncate max-w-[80px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                    {sym.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums leading-none mt-0.5">
                  <span className={isDark ? 'text-[#d1d4dc]' : 'text-[#131722]'}>
                    {sym.price >= 1000
                      ? sym.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : sym.price >= 1
                      ? sym.price.toFixed(2)
                      : sym.price.toFixed(4)}
                  </span>
                  <span
                    className={`flex items-center font-medium ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {sym.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Mini Sparkline preview */}
              <div className="w-12 h-5 hidden sm:block shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {sym.sparkline.length > 2 && (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 50 20">
                    {(() => {
                      const min = Math.min(...sym.sparkline);
                      const max = Math.max(...sym.sparkline);
                      const range = max - min || 1;
                      const points = sym.sparkline
                        .map((val, idx) => {
                          const x = (idx / (sym.sparkline.length - 1)) * 50;
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
            </button>
          );
        })}
      </div>

      {/* Scroll right button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className={`absolute right-0 top-0 bottom-0 z-10 px-1.5 flex items-center justify-center transition-colors ${
          isDark
            ? 'bg-gradient-to-l from-[#131722] via-[#131722]/90 to-transparent text-neutral-400 hover:text-white'
            : 'bg-gradient-to-l from-white via-white/90 to-transparent text-neutral-500 hover:text-black'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
