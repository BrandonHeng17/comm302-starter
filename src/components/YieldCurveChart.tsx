import React from 'react';
import { US_YIELD_CURVE_DATA, CENTRAL_BANK_RATES } from '../data/marketData';
import { Landmark, TrendingUp, Info } from 'lucide-react';

interface YieldCurveChartProps {
  isDark: boolean;
}

export const YieldCurveChart: React.FC<YieldCurveChartProps> = ({ isDark }) => {
  const curvePoints = US_YIELD_CURVE_DATA;

  // Min / max yield for SVG mapping
  const minY = 3.2;
  const maxY = 5.8;
  const height = 240;
  const width = 600;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerW = width - paddingLeft - paddingRight;
  const innerH = height - paddingTop - paddingBottom;

  const yToCoord = (val: number) => {
    const ratio = (val - minY) / (maxY - minY);
    return paddingTop + innerH - ratio * innerH;
  };

  const xToCoord = (idx: number) => {
    return paddingLeft + (idx / (curvePoints.length - 1)) * innerW;
  };

  // 10Y vs 2Y Spread
  const y10 = curvePoints.find(p => p.tenor === '10Y')?.current ?? 4.08;
  const y02 = curvePoints.find(p => p.tenor === '2Y')?.current ?? 3.95;
  const spread2_10 = (y10 - y02) * 100; // in bps

  return (
    <div className="space-y-6">
      {/* Top Card: US Treasury Yield Curve */}
      <div
        className={`rounded-lg border p-4 transition-colors ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#2962ff]" />
              <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                US Treasury Yield Curve
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
              Benchmark sovereign debt yield term structure across maturities
            </p>
          </div>

          {/* 10Y - 2Y Spread Callout */}
          <div
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-3 text-xs font-mono tabular-nums ${
              isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
            }`}
          >
            <span className={isDark ? 'text-[#787b86]' : 'text-neutral-500'}>2Y/10Y Spread:</span>
            <span className={`font-bold ${spread2_10 >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
              {spread2_10 >= 0 ? '+' : ''}{spread2_10.toFixed(0)} bps
            </span>
            <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
              Normal (Non-Inverted)
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2962ff]"></span>
            <span className="font-semibold text-white">Current Yield Curve</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-3 h-0.5 bg-amber-400 stroke-dashed"></span>
            <span>1 Month Ago</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-3 h-0.5 bg-neutral-600"></span>
            <span>1 Year Ago</span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[800px] h-[240px] overflow-visible">
            {/* Horizontal Grid lines */}
            {[3.5, 4.0, 4.5, 5.0, 5.5].map((val) => {
              const y = yToCoord(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke={isDark ? '#2a2e39' : '#e2e8f0'}
                    strokeDasharray="2 3"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    fill={isDark ? '#787b86' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* 1 Year Ago Line */}
            <polyline
              fill="none"
              stroke="#52525b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              points={curvePoints.map((p, idx) => `${xToCoord(idx)},${yToCoord(p.yearAgo)}`).join(' ')}
            />

            {/* 1 Month Ago Line */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeDasharray="3 2"
              points={curvePoints.map((p, idx) => `${xToCoord(idx)},${yToCoord(p.monthAgo)}`).join(' ')}
            />

            {/* Current Line */}
            <polyline
              fill="none"
              stroke="#2962ff"
              strokeWidth="2.5"
              points={curvePoints.map((p, idx) => `${xToCoord(idx)},${yToCoord(p.current)}`).join(' ')}
            />

            {/* Data points for Current */}
            {curvePoints.map((p, idx) => {
              const cx = xToCoord(idx);
              const cy = yToCoord(p.current);
              return (
                <g key={p.tenor}>
                  <circle cx={cx} cy={cy} r="4" fill="#2962ff" stroke={isDark ? '#1e222d' : '#ffffff'} strokeWidth="2" />
                  <text
                    x={cx}
                    y={cy - 8}
                    fill={isDark ? '#ffffff' : '#0f172a'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {p.current.toFixed(2)}%
                  </text>
                  <text
                    x={cx}
                    y={height - 8}
                    fill={isDark ? '#787b86' : '#64748b'}
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {p.tenor}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Central Bank Rates Table */}
      <div
        className={`rounded-lg border overflow-hidden transition-colors ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
        }`}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between border-neutral-700/40">
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Major Central Bank Benchmark Rates
            </h3>
            <p className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
              Policy target rates and upcoming monetary decision meetings
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] ${isDark ? 'bg-[#181b24] border-[#2a2e39] text-[#787b86]' : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-500'}`}>
                <th className="py-2.5 px-4 font-normal">Central Bank</th>
                <th className="py-2.5 px-4 font-normal">Country</th>
                <th className="py-2.5 px-4 font-normal text-right">Policy Rate</th>
                <th className="py-2.5 px-4 font-normal text-right">Last Change</th>
                <th className="py-2.5 px-4 font-normal text-right">Next Meeting</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2a2e39]' : 'divide-[#e0e3eb]'}`}>
              {CENTRAL_BANK_RATES.map(item => (
                <tr key={item.bank} className={isDark ? 'hover:bg-[#252936]' : 'hover:bg-[#f8f9fd]'}>
                  <td className="py-3 px-4 font-semibold text-white">{item.bank}</td>
                  <td className="py-3 px-4 text-neutral-400">{item.country}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                    {item.rate.toFixed(2)}%
                  </td>
                  <td className={`py-3 px-4 text-right font-mono tabular-nums ${item.change < 0 ? 'text-[#089981]' : item.change > 0 ? 'text-[#f23645]' : 'text-neutral-400'}`}>
                    {item.change !== 0 ? (item.change > 0 ? `+${item.change.toFixed(2)}%` : `${item.change.toFixed(2)}%`) : '0.00%'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-400">{item.nextMeeting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
