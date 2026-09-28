import React, { useState } from 'react';
import { SP500_SECTORS, CRYPTO_TREEMAP_DATA } from '../data/heatmaps';
import { SymbolLogo } from './SymbolLogo';
import { Info, Layers } from 'lucide-react';

interface HeatmapViewProps {
  onSelectSymbol: (ticker: string) => void;
  isDark: boolean;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  onSelectSymbol,
  isDark,
}) => {
  const [marketType, setMarketType] = useState<'sp500' | 'crypto'>('sp500');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1D');
  const [hoveredStock, setHoveredStock] = useState<{
    ticker: string;
    name: string;
    marketCap: number;
    changePercent: number;
    price: number;
  } | null>(null);

  // Helper for background color gradient based on change percent
  const getChangeBg = (change: number): string => {
    if (change >= 4.0) return 'bg-[#00897b] text-white';
    if (change >= 2.0) return 'bg-[#089981] text-white';
    if (change >= 0.8) return 'bg-[#22ab94] text-white';
    if (change > 0) return 'bg-[#26a69a]/70 text-white';
    if (change === 0) return 'bg-[#434651] text-white';
    if (change > -0.8) return 'bg-[#ef5350]/70 text-white';
    if (change > -2.0) return 'bg-[#f7525f] text-white';
    if (change > -4.0) return 'bg-[#f23645] text-white';
    return 'bg-[#c62828] text-white';
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      {/* Heatmap Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Market Heatmap
          </h2>
          <p className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
            Sector performance weighted by market capitalization
          </p>
        </div>

        {/* Switch between S&P 500 and Crypto */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center p-0.5 rounded border text-xs font-medium ${
              isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#f0f3fa] border-[#e0e3eb]'
            }`}
          >
            <button
              onClick={() => setMarketType('sp500')}
              className={`px-3 py-1.5 rounded transition-colors ${
                marketType === 'sp500'
                  ? 'bg-[#2962ff] text-white'
                  : isDark
                  ? 'text-[#787b86] hover:text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              S&P 500
            </button>
            <button
              onClick={() => setMarketType('crypto')}
              className={`px-3 py-1.5 rounded transition-colors ${
                marketType === 'crypto'
                  ? 'bg-[#2962ff] text-white'
                  : isDark
                  ? 'text-[#787b86] hover:text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Crypto
            </button>
          </div>

          {/* Timeframe */}
          <div
            className={`flex items-center p-0.5 rounded border text-xs ${
              isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#f0f3fa] border-[#e0e3eb]'
            }`}
          >
            {(['1D', '1W', '1M', 'YTD'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedTimeframe === tf
                    ? 'bg-[#2962ff] text-white font-medium'
                    : isDark
                    ? 'text-[#787b86] hover:text-white'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between gap-2 mb-4 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400">Scale:</span>
          <div className="flex items-center gap-0.5">
            <span className="w-5 h-3 bg-[#c62828] rounded-xs text-[9px] text-white text-center leading-3">-4%</span>
            <span className="w-5 h-3 bg-[#f23645] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#f7525f] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#434651] rounded-xs text-[9px] text-white text-center leading-3">0</span>
            <span className="w-5 h-3 bg-[#26a69a] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#22ab94] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#089981] rounded-xs text-[9px] text-white text-center leading-3">+4%</span>
          </div>
        </div>

        {hoveredStock && (
          <div className="font-sans flex items-center gap-2 text-xs">
            <span className="font-bold text-white">{hoveredStock.ticker}</span>
            <span className="text-neutral-400">· {hoveredStock.name}</span>
            <span className="font-mono tabular-nums text-white">${hoveredStock.price.toFixed(2)}</span>
            <span className={`font-mono font-bold tabular-nums ${hoveredStock.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              {hoveredStock.changePercent >= 0 ? '+' : ''}{hoveredStock.changePercent.toFixed(2)}%
            </span>
            <span className="text-neutral-400">(${hoveredStock.marketCap}B)</span>
          </div>
        )}
      </div>

      {/* S&P 500 Sectors Treemap Container */}
      {marketType === 'sp500' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SP500_SECTORS.map(sector => (
            <div
              key={sector.id}
              className={`p-3 rounded-md border flex flex-col justify-between ${
                isDark ? 'bg-[#151924] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
              }`}
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {sector.name}
                </span>
                <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                  <span className="text-neutral-400">{sector.marketCapText}</span>
                  <span className={`font-bold ${sector.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {sector.changePercent >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Stock blocks inside sector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 flex-1 min-h-[140px]">
                {sector.stocks.map(stock => {
                  const bgClass = getChangeBg(stock.changePercent);

                  return (
                    <button
                      key={stock.ticker}
                      onClick={() => onSelectSymbol(stock.ticker)}
                      onMouseEnter={() => setHoveredStock(stock)}
                      onMouseLeave={() => setHoveredStock(null)}
                      className={`${bgClass} p-2 rounded transition-transform hover:scale-[1.03] hover:z-10 shadow-xs flex flex-col justify-between text-left`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs tracking-tight">{stock.ticker}</span>
                        <span className="text-[10px] opacity-80">${stock.marketCap}B</span>
                      </div>
                      <div className="font-mono text-xs font-bold tabular-nums mt-1">
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Crypto Treemap Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {CRYPTO_TREEMAP_DATA.map(coin => {
            const bgClass = getChangeBg(coin.changePercent);

            return (
              <button
                key={coin.ticker}
                onClick={() => onSelectSymbol(`${coin.ticker}USD`)}
                onMouseEnter={() =>
                  setHoveredStock({
                    ticker: coin.ticker,
                    name: coin.name,
                    marketCap: coin.marketCap,
                    changePercent: coin.changePercent,
                    price: coin.price,
                  })
                }
                onMouseLeave={() => setHoveredStock(null)}
                className={`${bgClass} p-3 rounded-lg min-h-[90px] flex flex-col justify-between text-left transition-transform hover:scale-[1.03] shadow-xs`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">{coin.ticker}</span>
                  <span className="text-[10px] opacity-80">${coin.marketCap}B</span>
                </div>
                <div className="font-mono text-xs font-bold tabular-nums">
                  {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent.toFixed(2)}%
                </div>
                <div className="text-[10px] opacity-80 truncate">{coin.name}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
