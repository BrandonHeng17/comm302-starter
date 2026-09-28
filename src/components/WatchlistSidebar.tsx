import React, { useState } from 'react';
import { SymbolQuote, UserPortfolio } from '../types';
import { SymbolLogo } from './SymbolLogo';
import {
  X,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Bell,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

interface WatchlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: SymbolQuote[];
  watchlist: string[];
  onRemoveFromWatchlist: (ticker: string) => void;
  onSelectSymbol: (ticker: string) => void;
  selectedTicker: string;
  portfolio: UserPortfolio;
  onExecuteTrade: (ticker: string, type: 'BUY' | 'SELL', shares: number) => void;
  alerts: { id: string; ticker: string; targetPrice: number; condition: 'ABOVE' | 'BELOW' }[];
  onAddAlert: (ticker: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  onRemoveAlert: (id: string) => void;
  isDark: boolean;
  onOpenSearch: () => void;
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  isOpen,
  onClose,
  symbols,
  watchlist,
  onRemoveFromWatchlist,
  onSelectSymbol,
  selectedTicker,
  portfolio,
  onExecuteTrade,
  alerts,
  onAddAlert,
  onRemoveAlert,
  isDark,
  onOpenSearch,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'trade' | 'alerts'>('watchlist');

  // Trade form states
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeConfirmation, setTradeConfirmation] = useState<string | null>(null);

  // Alert form states
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  const selectedSymbol = symbols.find(s => s.ticker === selectedTicker) || symbols[0];
  const watchedSymbols = symbols.filter(s => watchlist.includes(s.ticker));

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol || tradeShares <= 0) return;
    onExecuteTrade(selectedSymbol.ticker, tradeType, tradeShares);
    setTradeConfirmation(
      `Executed ${tradeType} for ${tradeShares} shares of ${selectedSymbol.ticker} at $${selectedSymbol.price.toFixed(2)}`
    );
    setTimeout(() => setTradeConfirmation(null), 3500);
  };

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(alertTargetPrice);
    if (!selectedSymbol || isNaN(priceNum) || priceNum <= 0) return;
    onAddAlert(selectedSymbol.ticker, priceNum, alertCondition);
    setAlertTargetPrice('');
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed top-14 right-0 bottom-0 z-50 w-full sm:w-[380px] border-l shadow-2xl flex flex-col transition-all duration-300 ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-[#ffffff] border-[#e0e3eb] text-[#131722]'
      }`}
    >
      {/* Drawer Header */}
      <div className={`p-3 border-b flex items-center justify-between ${isDark ? 'border-[#2a2e39]' : 'border-[#e0e3eb]'}`}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-[#2962ff] text-white'
                : isDark
                ? 'text-[#787b86] hover:text-white'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'trade'
                ? 'bg-[#2962ff] text-white'
                : isDark
                ? 'text-[#787b86] hover:text-white'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Paper Trade
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'alerts'
                ? 'bg-[#2962ff] text-white'
                : isDark
                ? 'text-[#787b86] hover:text-white'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Alerts ({alerts.length})
          </button>
        </div>

        <button
          onClick={onClose}
          className={`p-1 rounded transition-colors ${
            isDark ? 'text-[#787b86] hover:text-white' : 'text-neutral-500 hover:text-black'
          }`}
          aria-label="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab 1: Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">My Pinned Symbols</span>
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1 text-xs text-[#2962ff] hover:underline font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Symbol</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {watchedSymbols.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500 space-y-2">
                <p>No symbols in your watchlist.</p>
                <button
                  onClick={onOpenSearch}
                  className="px-3 py-1.5 bg-[#2962ff] text-white rounded text-xs font-medium"
                >
                  Browse Symbols
                </button>
              </div>
            ) : (
              watchedSymbols.map(sym => {
                const isUp = sym.change >= 0;
                const isSelected = selectedTicker === sym.ticker;

                return (
                  <div
                    key={sym.ticker}
                    onClick={() => onSelectSymbol(sym.ticker)}
                    className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-[#2a2e39]'
                          : 'bg-[#f0f3fa]'
                        : isDark
                        ? 'hover:bg-[#252936]'
                        : 'hover:bg-[#f8f9fd]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <SymbolLogo ticker={sym.ticker} size="sm" />
                      <div>
                        <div className="font-bold text-xs text-white">{sym.ticker}</div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[110px]">{sym.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-semibold text-xs text-white">
                          {sym.price >= 1000 ? sym.price.toFixed(1) : sym.price.toFixed(2)}
                        </div>
                        <div className={`text-[10px] font-medium ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isUp ? '+' : ''}{sym.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(sym.ticker);
                        }}
                        className="text-neutral-500 hover:text-rose-500 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Paper Trading */}
      {activeTab === 'trade' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Portfolio Cash Box */}
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'}`}>
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#2962ff]" />
                <span>Paper Trading Cash</span>
              </span>
              <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                Simulated
              </span>
            </div>
            <div className="font-mono font-black text-lg text-white tabular-nums">
              ${portfolio.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Trade Order Form */}
          <form onSubmit={handleTradeSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Target Asset</span>
              <div className="flex items-center gap-1.5 font-bold font-mono">
                <SymbolLogo ticker={selectedSymbol.ticker} size="sm" />
                <span>{selectedSymbol.ticker}</span>
                <span className="text-neutral-400">(${selectedSymbol.price.toFixed(2)})</span>
              </div>
            </div>

            {/* Buy / Sell switch */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded font-bold transition-colors ${
                  tradeType === 'BUY'
                    ? 'bg-[#089981] text-white shadow-sm'
                    : isDark
                    ? 'bg-[#181b24] text-neutral-400 border border-[#2a2e39]'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded font-bold transition-colors ${
                  tradeType === 'SELL'
                    ? 'bg-[#f23645] text-white shadow-sm'
                    : isDark
                    ? 'bg-[#181b24] text-neutral-400 border border-[#2a2e39]'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                SELL
              </button>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-neutral-400 mb-1">Quantity (Shares / Units)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={tradeShares}
                onChange={e => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-full px-3 py-2 rounded font-mono font-bold text-sm border outline-none ${
                  isDark
                    ? 'bg-[#131722] border-[#2a2e39] text-white focus:border-[#2962ff]'
                    : 'bg-white border-[#e0e3eb] text-black focus:border-[#2962ff]'
                }`}
              />
            </div>

            {/* Order Total */}
            <div className="p-2.5 rounded bg-black/20 flex items-center justify-between font-mono">
              <span className="text-neutral-400">Estimated Total:</span>
              <span className="font-bold text-sm text-white">
                ${(tradeShares * selectedSymbol.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded font-bold text-white transition-colors shadow-sm ${
                tradeType === 'BUY' ? 'bg-[#089981] hover:bg-[#07826e]' : 'bg-[#f23645] hover:bg-[#d92938]'
              }`}
            >
              Confirm {tradeType} Order
            </button>
          </form>

          {/* Trade Confirmation Notice */}
          {tradeConfirmation && (
            <div className="p-2.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{tradeConfirmation}</span>
            </div>
          )}

          {/* Current Positions */}
          <div className="border-t pt-3 border-neutral-700/40">
            <h4 className="font-semibold text-neutral-400 mb-2">Open Positions</h4>
            {portfolio.positions.length === 0 ? (
              <p className="text-neutral-500 italic">No open paper positions yet.</p>
            ) : (
              <div className="space-y-2">
                {portfolio.positions.map(pos => {
                  const currentQuote = symbols.find(s => s.ticker === pos.ticker);
                  const curPrice = currentQuote ? currentQuote.price : pos.currentPrice;
                  const pnl = (curPrice - pos.avgPrice) * pos.shares;

                  return (
                    <div
                      key={pos.ticker}
                      className={`p-2 rounded border flex items-center justify-between text-xs ${
                        isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">{pos.ticker}</div>
                        <div className="text-[10px] text-neutral-400">
                          {pos.shares} shares @ ${pos.avgPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-bold text-white">${(curPrice * pos.shares).toFixed(2)}</div>
                        <div className={`text-[10px] ${pnl >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Alerts */}
      {activeTab === 'alerts' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <form onSubmit={handleAlertSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Create Price Alert</span>
              <span className="font-mono text-xs text-[#2962ff]">{selectedSymbol.ticker}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAlertCondition('ABOVE')}
                className={`py-1.5 rounded font-medium ${
                  alertCondition === 'ABOVE' ? 'bg-[#2962ff] text-white' : 'bg-black/20 text-neutral-400'
                }`}
              >
                Crosses Above
              </button>
              <button
                type="button"
                onClick={() => setAlertCondition('BELOW')}
                className={`py-1.5 rounded font-medium ${
                  alertCondition === 'BELOW' ? 'bg-[#2962ff] text-white' : 'bg-black/20 text-neutral-400'
                }`}
              >
                Crosses Below
              </button>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Target Price (USD / Currency)</label>
              <input
                type="number"
                step="any"
                placeholder={selectedSymbol.price.toFixed(2)}
                value={alertTargetPrice}
                onChange={e => setAlertTargetPrice(e.target.value)}
                className={`w-full px-3 py-2 rounded font-mono border outline-none ${
                  isDark ? 'bg-[#131722] border-[#2a2e39] text-white' : 'bg-white border-[#e0e3eb] text-black'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#2962ff] hover:bg-[#1e53e5] text-white font-bold rounded"
            >
              Add Price Alert
            </button>
          </form>

          {/* Active alerts list */}
          <div className="border-t pt-3 border-neutral-700/40">
            <h4 className="font-semibold text-neutral-400 mb-2">Active Triggers</h4>
            {alerts.length === 0 ? (
              <p className="text-neutral-500 italic">No price alerts active.</p>
            ) : (
              <div className="space-y-2">
                {alerts.map(alt => (
                  <div
                    key={alt.id}
                    className={`p-2.5 rounded border flex items-center justify-between ${
                      isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">{alt.ticker}</div>
                      <div className="text-[10px] text-neutral-400">
                        {alt.condition} ${alt.targetPrice.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveAlert(alt.id)}
                      className="text-neutral-500 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
