import React, { useState, useMemo } from 'react';
import { SymbolQuote, TechnicalRating } from '../types';
import { SymbolLogo } from './SymbolLogo';
import { Search, Download, ArrowUpDown, Filter, Bookmark, ExternalLink } from 'lucide-react';

interface ScreenerViewProps {
  symbols: SymbolQuote[];
  selectedTicker: string;
  onSelectSymbol: (ticker: string) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  onOpenChartModal: (ticker: string) => void;
  isDark: boolean;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({
  symbols,
  selectedTicker,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  onOpenChartModal,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof SymbolQuote>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sectors list from symbols
  const sectors = useMemo(() => {
    const set = new Set<string>();
    symbols.forEach(s => {
      if (s.sector) set.add(s.sector);
    });
    return Array.from(set);
  }, [symbols]);

  // Handle column sorting
  const handleSort = (field: keyof SymbolQuote) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    return symbols.filter(s => {
      // Search
      const matchesSearch =
        s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Category
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;

      // Rating
      if (selectedRating !== 'all' && s.technicalRating !== selectedRating) return false;

      // Sector
      if (selectedSector !== 'all' && s.sector !== selectedSector) return false;

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField] ?? 0;
      let bVal = b[sortField] ?? 0;
      if (typeof aVal === 'string') aVal = (aVal as string).toLowerCase();
      if (typeof bVal === 'string') bVal = (bVal as string).toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [symbols, searchQuery, selectedCategory, selectedRating, selectedSector, sortField, sortOrder]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Ticker', 'Name', 'Category', 'Price', 'Change%', 'Volume', 'MarketCap', 'Rating', 'PE'];
    const rows = filteredData.map(s => [
      s.ticker,
      `"${s.name}"`,
      s.category,
      s.price,
      s.changePercent,
      s.volume,
      s.marketCap || 0,
      s.technicalRating,
      s.peRatio || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tradingview_screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Multi-Asset Screener
          </h2>
          <p className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
            Filter across stocks, cryptocurrencies, indices, and commodities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc] hover:text-white hover:border-[#363a45]'
                : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-700 hover:text-black hover:border-neutral-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className={`p-3 rounded-lg border mb-4 flex flex-wrap items-center gap-3 text-xs ${
          isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
        }`}
      >
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search ticker or name..."
            className={`w-full pl-8 pr-3 py-1.5 rounded text-xs border outline-none ${
              isDark
                ? 'bg-[#131722] border-[#2a2e39] text-white focus:border-[#2962ff]'
                : 'bg-white border-[#e0e3eb] text-black focus:border-[#2962ff]'
            }`}
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className={`px-2.5 py-1.5 rounded border text-xs outline-none ${
            isDark
              ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
              : 'bg-white border-[#e0e3eb] text-neutral-800'
          }`}
        >
          <option value="all">All Asset Classes</option>
          <option value="stock">Stocks</option>
          <option value="crypto">Crypto</option>
          <option value="index">Indices</option>
          <option value="forex">Forex</option>
          <option value="future">Futures</option>
          <option value="bond">Bonds</option>
        </select>

        {/* Sector Filter */}
        {sectors.length > 0 && (
          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            className={`px-2.5 py-1.5 rounded border text-xs outline-none ${
              isDark
                ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
                : 'bg-white border-[#e0e3eb] text-neutral-800'
            }`}
          >
            <option value="all">All Sectors</option>
            {sectors.map(sec => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        )}

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={e => setSelectedRating(e.target.value)}
          className={`px-2.5 py-1.5 rounded border text-xs outline-none ${
            isDark
              ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
              : 'bg-white border-[#e0e3eb] text-neutral-800'
          }`}
        >
          <option value="all">All Ratings</option>
          <option value="Strong Buy">Strong Buy</option>
          <option value="Buy">Buy</option>
          <option value="Neutral">Neutral</option>
          <option value="Sell">Sell</option>
          <option value="Strong Sell">Strong Sell</option>
        </select>

        <span className="text-[11px] text-neutral-400 ml-auto font-mono">
          {filteredData.length} symbols found
        </span>
      </div>

      {/* Screener Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className={`border-b text-[11px] ${
                isDark ? 'bg-[#181b24] border-[#2a2e39] text-[#787b86]' : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-500'
              }`}
            >
              <th className="py-2.5 px-3 font-normal cursor-pointer" onClick={() => handleSort('ticker')}>
                <div className="flex items-center gap-1">
                  <span>Symbol</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal text-right cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal text-right cursor-pointer" onClick={() => handleSort('changePercent')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal text-right cursor-pointer hidden md:table-cell" onClick={() => handleSort('volume')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal text-right cursor-pointer hidden lg:table-cell" onClick={() => handleSort('marketCap')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Market Cap</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal text-right cursor-pointer hidden xl:table-cell" onClick={() => handleSort('peRatio')}>
                <div className="flex items-center justify-end gap-1">
                  <span>P/E</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal text-center cursor-pointer" onClick={() => handleSort('technicalRating')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Rating</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal text-center hidden sm:table-cell">Trend (7D)</th>
              <th className="py-2.5 px-3 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-[#2a2e39]' : 'divide-[#e0e3eb]'}`}>
            {filteredData.map(sym => {
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
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <SymbolLogo ticker={sym.ticker} size="sm" />
                      <div>
                        <div className="font-semibold text-xs text-white flex items-center gap-1">
                          <span>{sym.ticker}</span>
                          <span className="text-[10px] font-normal text-neutral-400 capitalize">
                            · {sym.category}
                          </span>
                        </div>
                        <div className={`text-[11px] truncate max-w-[130px] ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                          {sym.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono font-medium tabular-nums">
                    {sym.price >= 1000
                      ? sym.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : sym.price >= 1
                      ? sym.price.toFixed(2)
                      : sym.price.toFixed(4)}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded font-semibold ${
                        isUp ? 'bg-[#089981]/15 text-[#089981]' : 'bg-[#f23645]/15 text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{sym.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums hidden md:table-cell text-neutral-400">
                    {sym.volumeText || (sym.volume > 0 ? (sym.volume / 1e6).toFixed(1) + 'M' : '—')}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums hidden lg:table-cell text-neutral-400">
                    {sym.marketCapText || '—'}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums hidden xl:table-cell text-neutral-400">
                    {sym.peRatio ? sym.peRatio.toFixed(1) : '—'}
                  </td>

                  <td className="py-2.5 px-3 text-center">
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

                  <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                    <div className="w-16 h-5 mx-auto">
                      {sym.sparkline.length > 2 && (
                        <svg className="w-full h-full" viewBox="0 0 60 20">
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

                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleWatchlist(sym.ticker)}
                        className={`p-1.5 rounded transition-colors ${
                          isInWatch
                            ? 'text-[#2962ff] bg-[#2962ff]/10'
                            : isDark
                            ? 'text-[#787b86] hover:text-white'
                            : 'text-neutral-400 hover:text-black'
                        }`}
                        title={isInWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isInWatch ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => onOpenChartModal(sym.ticker)}
                        className={`p-1.5 rounded transition-colors ${
                          isDark ? 'text-[#787b86] hover:text-white' : 'text-neutral-400 hover:text-black'
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
