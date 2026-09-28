import React from 'react';

interface SymbolLogoProps {
  ticker: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SymbolLogo: React.FC<SymbolLogoProps> = ({
  ticker,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  // Custom SVG and badge colors for famous symbols
  const renderVisual = () => {
    switch (ticker) {
      case 'AAPL':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#1e222d] border border-neutral-700/50 flex items-center justify-center text-white font-semibold`}>
            <svg viewBox="0 0 170 170" className="w-3/5 h-3/5 fill-current">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.87-8.91-10.4-19.16-13.58-30.74-3.18-11.58-4.77-22.38-4.77-32.4 0-14.34 3.7-26.35 11.08-36.03 7.39-9.67 16.74-14.63 28.05-14.88 4.58 0 9.87 1.25 15.87 3.74 6 2.5 10.02 3.75 12.06 3.75 1.7 0 5.86-1.31 12.48-3.92 6.62-2.61 12.23-3.81 16.84-3.6 12.5.87 22.38 5.76 29.63 14.68-10.98 6.63-16.36 15.82-16.14 27.56.22 9.24 3.86 17.07 10.92 23.48 7.07 6.41 15.44 10.05 25.12 10.93-2.18 6.52-4.68 13.04-7.51 19.57zM119.22 31.84c0-7.17 2.61-13.91 7.83-20.22 5.22-6.3 11.63-10.54 19.24-12.72.33 1.3.49 2.5.49 3.59 0 7.17-2.67 14.07-8.01 20.7-5.33 6.63-11.85 10.65-19.55 12.07v-3.42z" />
            </svg>
          </div>
        );
      case 'NVDA':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#76b900] flex items-center justify-center text-black font-black tracking-tighter`}>
            N
          </div>
        );
      case 'MSFT':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#1e222d] border border-neutral-700/50 p-1 flex flex-wrap gap-0.5 items-center justify-center`}>
            <div className="w-1.5 h-1.5 bg-[#f25022]"></div>
            <div className="w-1.5 h-1.5 bg-[#7fba00]"></div>
            <div className="w-1.5 h-1.5 bg-[#00a4ef]"></div>
            <div className="w-1.5 h-1.5 bg-[#ffb900]"></div>
          </div>
        );
      case 'GOOGL':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-white text-slate-800 flex items-center justify-center font-bold border border-neutral-300`}>
            <span className="text-[#4285F4]">G</span>
          </div>
        );
      case 'AMZN':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#ff9900] text-black flex items-center justify-center font-bold text-[11px]`}>
            a
          </div>
        );
      case 'META':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#0081fb] text-white flex items-center justify-center font-bold text-[11px]`}>
            ∞
          </div>
        );
      case 'TSLA':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#e82127] text-white flex items-center justify-center font-bold text-[11px]`}>
            T
          </div>
        );
      case 'BTCUSD':
      case 'BTC':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#f7931a] text-white flex items-center justify-center font-bold`}>
            ₿
          </div>
        );
      case 'ETHUSD':
      case 'ETH':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#627eea] text-white flex items-center justify-center font-bold`}>
            Ξ
          </div>
        );
      case 'SOLUSD':
      case 'SOL':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] text-black flex items-center justify-center font-bold`}>
            ◎
          </div>
        );
      case 'BNBUSD':
      case 'BNB':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#F3BA2F] text-black flex items-center justify-center font-bold`}>
            B
          </div>
        );
      case 'XRPUSD':
      case 'XRP':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-black text-white border border-neutral-700 flex items-center justify-center font-bold text-[10px]`}>
            ✕
          </div>
        );
      case 'EURUSD':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#003399] text-[#ffcc00] flex items-center justify-center font-bold text-[10px]`}>
            €
          </div>
        );
      case 'GBPUSD':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#00247d] text-white flex items-center justify-center font-bold text-[10px]`}>
            £
          </div>
        );
      case 'USDJPY':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-neutral-800 text-rose-400 flex items-center justify-center font-bold text-[10px]`}>
            ¥
          </div>
        );
      case 'CL1!':
      case 'BZ1!':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-neutral-900 border border-neutral-700 text-amber-500 flex items-center justify-center font-bold text-[10px]`}>
            🛢️
          </div>
        );
      case 'GC1!':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 text-neutral-950 flex items-center justify-center font-bold text-[10px]`}>
            AU
          </div>
        );
      case 'SI1!':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-neutral-950 flex items-center justify-center font-bold text-[10px]`}>
            AG
          </div>
        );
      case 'SPX':
      case 'NDX':
      case 'DJI':
      case 'RUT':
      case 'DAX':
      case 'NI225':
      case 'HSI':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#2962ff]/20 text-[#2962ff] border border-[#2962ff]/40 flex items-center justify-center font-bold tracking-tight text-[9px]`}>
            {ticker.slice(0, 3)}
          </div>
        );
      case 'US10Y':
      case 'US02Y':
      case 'US30Y':
      case 'DE10Y':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 flex items-center justify-center font-bold text-[9px]`}>
            %
          </div>
        );
      default:
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-[#2a2e39] text-[#d1d4dc] border border-[#363a45] flex items-center justify-center font-semibold text-[10px]`}>
            {ticker.slice(0, 2)}
          </div>
        );
    }
  };

  return (
    <div className={`shrink-0 inline-flex items-center justify-center ${className}`}>
      {renderVisual()}
    </div>
  );
};
