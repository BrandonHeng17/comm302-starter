import React from 'react';
import { TechnicalRating } from '../types';

interface TechnicalGaugeProps {
  rating: TechnicalRating;
  oscillators: { buy: number; neutral: number; sell: number; rating: TechnicalRating };
  movingAverages: { buy: number; neutral: number; sell: number; rating: TechnicalRating };
  isDark: boolean;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({
  rating,
  oscillators,
  movingAverages,
  isDark,
}) => {
  // Convert rating to needle angle (-75deg to +75deg)
  const getAngle = (r: TechnicalRating): number => {
    switch (r) {
      case 'Strong Sell':
        return -65;
      case 'Sell':
        return -32;
      case 'Neutral':
        return 0;
      case 'Buy':
        return 32;
      case 'Strong Buy':
        return 65;
      default:
        return 0;
    }
  };

  const getRatingColor = (r: TechnicalRating): string => {
    switch (r) {
      case 'Strong Sell':
        return '#f23645';
      case 'Sell':
        return '#f7525f';
      case 'Neutral':
        return '#787b86';
      case 'Buy':
        return '#22ab94';
      case 'Strong Buy':
        return '#089981';
      default:
        return '#787b86';
    }
  };

  const needleAngle = getAngle(rating);
  const ratingColor = getRatingColor(rating);

  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
          Technical Analysis
        </h3>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: `${ratingColor}22`, color: ratingColor }}
        >
          {rating}
        </span>
      </div>

      {/* Speedometer Arc SVG */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <svg viewBox="0 0 200 115" className="w-48 overflow-visible">
          {/* Background Track Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke={isDark ? '#2a2e39' : '#e2e8f0'}
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Color Segments */}
          {/* Strong Sell */}
          <path
            d="M 25 100 A 75 75 0 0 1 50 48"
            fill="none"
            stroke="#f23645"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Sell */}
          <path
            d="M 54 44 A 75 75 0 0 1 85 28"
            fill="none"
            stroke="#f7525f"
            strokeWidth="10"
          />
          {/* Neutral */}
          <path
            d="M 90 27 A 75 75 0 0 1 110 27"
            fill="none"
            stroke="#787b86"
            strokeWidth="10"
          />
          {/* Buy */}
          <path
            d="M 115 28 A 75 75 0 0 1 146 44"
            fill="none"
            stroke="#22ab94"
            strokeWidth="10"
          />
          {/* Strong Buy */}
          <path
            d="M 150 48 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="#089981"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Needle pivot and needle */}
          <g
            transform={`rotate(${needleAngle}, 100, 100)`}
            className="transition-transform duration-500 ease-out"
          >
            <polygon
              points="98,100 102,100 100,32"
              fill={isDark ? '#ffffff' : '#1e293b'}
            />
            <circle cx="100" cy="100" r="7" fill={isDark ? '#ffffff' : '#1e293b'} />
            <circle cx="100" cy="100" r="3" fill="#2962ff" />
          </g>

          {/* Labels on arc ends */}
          <text x="18" y="112" fill="#f23645" fontSize="8" fontWeight="bold">SELL</text>
          <text x="86" y="18" fill="#787b86" fontSize="8" fontWeight="bold">NEUTRAL</text>
          <text x="156" y="112" fill="#089981" fontSize="8" fontWeight="bold">BUY</text>
        </svg>

        {/* Big Verdict Text */}
        <div className="text-center mt-1">
          <div className="text-sm font-bold tracking-tight" style={{ color: ratingColor }}>
            {rating}
          </div>
          <p className="text-[11px] text-[#787b86]">Summary based on 26 indicators</p>
        </div>
      </div>

      {/* Oscillators & Moving Averages breakdown */}
      <div className={`mt-3 pt-3 border-t grid grid-cols-2 gap-3 text-xs ${isDark ? 'border-[#2a2e39]' : 'border-[#e0e3eb]'}`}>
        {/* Oscillators */}
        <div>
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className={isDark ? 'text-[#787b86]' : 'text-neutral-500'}>Oscillators</span>
            <span className="font-semibold text-[11px]" style={{ color: getRatingColor(oscillators.rating) }}>
              {oscillators.rating}
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] tabular-nums">
            <span className="text-[#f23645] bg-[#f23645]/10 px-1.5 py-0.5 rounded">
              {oscillators.sell} Sell
            </span>
            <span className="text-neutral-400 bg-neutral-500/10 px-1.5 py-0.5 rounded">
              {oscillators.neutral} Neutral
            </span>
            <span className="text-[#089981] bg-[#089981]/10 px-1.5 py-0.5 rounded">
              {oscillators.buy} Buy
            </span>
          </div>
        </div>

        {/* Moving Averages */}
        <div>
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className={isDark ? 'text-[#787b86]' : 'text-neutral-500'}>Moving Avgs</span>
            <span className="font-semibold text-[11px]" style={{ color: getRatingColor(movingAverages.rating) }}>
              {movingAverages.rating}
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] tabular-nums">
            <span className="text-[#f23645] bg-[#f23645]/10 px-1.5 py-0.5 rounded">
              {movingAverages.sell} Sell
            </span>
            <span className="text-neutral-400 bg-neutral-500/10 px-1.5 py-0.5 rounded">
              {movingAverages.neutral} Neutral
            </span>
            <span className="text-[#089981] bg-[#089981]/10 px-1.5 py-0.5 rounded">
              {movingAverages.buy} Buy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
