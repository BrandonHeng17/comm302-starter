import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CandlestickPoint, ChartStyle, Timeframe } from '../types';
import {
  CandlestickChart,
  LineChart,
  AreaChart,
  SlidersHorizontal,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface InteractiveChartProps {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: CandlestickPoint[];
  isDark: boolean;
  onOpenModal?: () => void;
  height?: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  ticker,
  name,
  price,
  change,
  changePercent,
  history,
  isDark,
  onOpenModal,
  height = 360,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candle');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showSMA, setShowSMA] = useState<boolean>(false);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Resize observer to get accurate chart container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter history based on selected timeframe
  const visibleData = useMemo(() => {
    if (!history || history.length === 0) return [];
    let count = history.length;
    switch (timeframe) {
      case '1D':
        count = Math.min(15, history.length);
        break;
      case '5D':
        count = Math.min(25, history.length);
        break;
      case '1M':
        count = Math.min(40, history.length);
        break;
      case '3M':
        count = Math.min(50, history.length);
        break;
      case '6M':
      case '1Y':
      case '5Y':
      case 'ALL':
        count = history.length;
        break;
    }

    // Apply zoom: zoomLevel > 1 means show fewer candles
    const zoomedCount = Math.max(10, Math.floor(count / zoomLevel));
    return history.slice(history.length - zoomedCount);
  }, [history, timeframe, zoomLevel]);

  // Compute min, max, price range
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (visibleData.length === 0) return { minPrice: 0, maxPrice: 100, maxVolume: 100 };
    let min = Infinity;
    let max = -Infinity;
    let volMax = 0;

    visibleData.forEach(d => {
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
      if (d.volume > volMax) volMax = d.volume;
    });

    const padding = (max - min) * 0.08 || 1;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      maxVolume: volMax || 1,
    };
  }, [visibleData]);

  // Calculate 20 EMA and 50 SMA
  const indicatorSeries = useMemo(() => {
    const emaPeriod = 14;
    const smaPeriod = 20;
    const emaValues: (number | null)[] = [];
    const smaValues: (number | null)[] = [];
    const rsiValues: (number | null)[] = [];

    // Simple SMA & EMA calculation
    const k = 2 / (emaPeriod + 1);
    let prevEMA: number | null = null;

    visibleData.forEach((bar, idx) => {
      // EMA
      if (idx === 0) {
        prevEMA = bar.close;
        emaValues.push(prevEMA);
      } else if (prevEMA !== null) {
        prevEMA = bar.close * k + prevEMA * (1 - k);
        emaValues.push(prevEMA);
      } else {
        emaValues.push(null);
      }

      // SMA
      if (idx >= smaPeriod - 1) {
        const slice = visibleData.slice(idx - smaPeriod + 1, idx + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        smaValues.push(sum / smaPeriod);
      } else {
        smaValues.push(null);
      }

      // Simplified RSI
      if (idx >= 14) {
        let gains = 0;
        let losses = 0;
        for (let j = idx - 13; j <= idx; j++) {
          const diff = visibleData[j].close - visibleData[j - 1].close;
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14 || 0.0001;
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        rsiValues.push(Number(rsi.toFixed(1)));
      } else {
        rsiValues.push(50);
      }
    });

    return { emaValues, smaValues, rsiValues };
  }, [visibleData]);

  // Dimensions & paddings
  const paddingRight = 68; // right axis for prices
  const paddingBottom = showRSI ? 80 : 36;
  const paddingTop = 24;
  const chartHeight = height - paddingBottom - paddingTop;
  const chartWidth = Math.max(100, containerWidth - paddingRight);

  const priceToY = (p: number) => {
    const range = maxPrice - minPrice || 1;
    return paddingTop + chartHeight - ((p - minPrice) / range) * chartHeight;
  };

  const yToPrice = (y: number) => {
    const range = maxPrice - minPrice || 1;
    const ratio = (paddingTop + chartHeight - y) / chartHeight;
    return minPrice + ratio * range;
  };

  const barCount = visibleData.length;
  const barSpacing = chartWidth / (barCount || 1);
  const barWidth = Math.max(2, barSpacing * 0.65);

  // Active bar for hover or latest
  const activeBar = hoverIndex !== null && visibleData[hoverIndex]
    ? visibleData[hoverIndex]
    : visibleData[visibleData.length - 1] || null;

  const isUpTrend = change >= 0;

  // Handle mouse move on chart canvas
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || visibleData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.floor(x / barSpacing);
    if (idx >= 0 && idx < visibleData.length) {
      setHoverIndex(idx);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Generate 5 Y-axis tick prices
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (maxPrice - minPrice) / 5;
    for (let i = 0; i <= 5; i++) {
      ticks.push(minPrice + i * step);
    }
    return ticks;
  }, [minPrice, maxPrice]);

  return (
    <div
      ref={containerRef}
      className={`rounded-lg border overflow-hidden select-none transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      {/* Top Chart Toolbar */}
      <div
        className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-[#181b24] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
        }`}
      >
        {/* Left: Timeframe selectors */}
        <div className="flex items-center gap-1">
          {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setZoomLevel(1);
              }}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : isDark
                  ? 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Center: Chart Style & Indicators */}
        <div className="flex items-center gap-2">
          {/* Chart Style Switcher */}
          <div
            className={`flex items-center p-0.5 rounded border ${
              isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
            }`}
          >
            <button
              onClick={() => setChartStyle('candle')}
              title="Candlestick chart"
              className={`p-1 rounded ${
                chartStyle === 'candle'
                  ? 'bg-[#2962ff] text-white'
                  : isDark
                  ? 'text-[#787b86] hover:text-white'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('area')}
              title="Area chart"
              className={`p-1 rounded ${
                chartStyle === 'area'
                  ? 'bg-[#2962ff] text-white'
                  : isDark
                  ? 'text-[#787b86] hover:text-white'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <AreaChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('line')}
              title="Line chart"
              className={`p-1 rounded ${
                chartStyle === 'line'
                  ? 'bg-[#2962ff] text-white'
                  : isDark
                  ? 'text-[#787b86] hover:text-white'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicator toggles */}
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
              showVolume
                ? isDark
                  ? 'bg-[#2a2e39] border-[#363a45] text-cyan-400'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-700'
                : isDark
                ? 'bg-transparent border-transparent text-[#787b86]'
                : 'text-neutral-500 border-transparent'
            }`}
          >
            Vol
          </button>
          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
              showEMA
                ? isDark
                  ? 'bg-[#2a2e39] border-[#363a45] text-[#2962ff]'
                  : 'bg-blue-50 border-blue-300 text-[#2962ff]'
                : isDark
                ? 'bg-transparent border-transparent text-[#787b86]'
                : 'text-neutral-500 border-transparent'
            }`}
          >
            EMA 20
          </button>
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
              showSMA
                ? isDark
                  ? 'bg-[#2a2e39] border-[#363a45] text-amber-400'
                  : 'bg-amber-50 border-amber-300 text-amber-700'
                : isDark
                ? 'bg-transparent border-transparent text-[#787b86]'
                : 'text-neutral-500 border-transparent'
            }`}
          >
            SMA 50
          </button>
          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
              showRSI
                ? isDark
                  ? 'bg-[#2a2e39] border-[#363a45] text-purple-400'
                  : 'bg-purple-50 border-purple-300 text-purple-700'
                : isDark
                ? 'bg-transparent border-transparent text-[#787b86]'
                : 'text-neutral-500 border-transparent'
            }`}
          >
            RSI
          </button>
        </div>

        {/* Right: Zoom & modal */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.3))}
            title="Zoom in"
            className={`p-1 rounded transition-colors ${
              isDark ? 'text-[#787b86] hover:text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.3))}
            title="Zoom out"
            className={`p-1 rounded transition-colors ${
              isDark ? 'text-[#787b86] hover:text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            title="Reset zoom"
            className={`p-1 rounded transition-colors ${
              isDark ? 'text-[#787b86] hover:text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onOpenModal && (
            <button
              onClick={onOpenModal}
              title="Full screen chart"
              className={`p-1 rounded transition-colors ${
                isDark ? 'text-[#787b86] hover:text-white' : 'text-neutral-500 hover:text-black'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bar Legend / Current Data readout */}
      {activeBar && (
        <div
          className={`px-4 py-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono tabular-nums border-b ${
            isDark ? 'bg-[#1a1e27] border-[#2a2e39]/60 text-[#787b86]' : 'bg-[#fafbfc] border-[#e0e3eb]/60 text-neutral-600'
          }`}
        >
          <div className="flex items-center gap-1 font-sans">
            <span className="font-semibold text-xs text-white">{ticker}</span>
            <span className="text-[10px] text-neutral-400">· {activeBar.time}</span>
          </div>
          <div>
            <span className="text-neutral-500 mr-1">O</span>
            <span className={activeBar.close >= activeBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
              {activeBar.open.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 mr-1">H</span>
            <span className={activeBar.close >= activeBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
              {activeBar.high.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 mr-1">L</span>
            <span className={activeBar.close >= activeBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
              {activeBar.low.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 mr-1">C</span>
            <span className={activeBar.close >= activeBar.open ? 'text-[#089981]' : 'text-[#f23645]'}>
              {activeBar.close.toFixed(2)}
            </span>
          </div>
          {showVolume && (
            <div>
              <span className="text-neutral-500 mr-1">Vol</span>
              <span className="text-neutral-300">
                {(activeBar.volume / 1000).toFixed(1)}k
              </span>
            </div>
          )}
          {showRSI && indicatorSeries.rsiValues[hoverIndex ?? visibleData.length - 1] && (
            <div>
              <span className="text-purple-400 mr-1">RSI (14)</span>
              <span className="text-purple-300">
                {indicatorSeries.rsiValues[hoverIndex ?? visibleData.length - 1]}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden" style={{ height }}>
        <svg
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background grid lines */}
          <g className="opacity-20">
            {yTicks.map((val, idx) => {
              const y = priceToY(val);
              return (
                <line
                  key={idx}
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke={isDark ? '#434651' : '#cbd5e1'}
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />
              );
            })}
            {visibleData.map((_, idx) => {
              if (idx % 6 !== 0) return null;
              const x = idx * barSpacing + barSpacing / 2;
              return (
                <line
                  key={idx}
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartHeight}
                  stroke={isDark ? '#434651' : '#cbd5e1'}
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* Volume sub-chart at bottom */}
          {showVolume && (
            <g className="opacity-60">
              {visibleData.map((d, idx) => {
                const x = idx * barSpacing + (barSpacing - barWidth) / 2;
                const volHeight = (d.volume / maxVolume) * (chartHeight * 0.22);
                const y = paddingTop + chartHeight - volHeight;
                const isBarGreen = d.close >= d.open;

                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={volHeight}
                    fill={isBarGreen ? '#089981' : '#f23645'}
                    opacity={hoverIndex === idx ? 0.9 : 0.4}
                  />
                );
              })}
            </g>
          )}

          {/* Chart Rendering: Area Mode */}
          {chartStyle === 'area' && visibleData.length > 0 && (
            <g>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2962ff" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {(() => {
                const points = visibleData
                  .map((d, idx) => {
                    const x = idx * barSpacing + barSpacing / 2;
                    const y = priceToY(d.close);
                    return `${x},${y}`;
                  })
                  .join(' ');
                const firstX = barSpacing / 2;
                const lastX = (visibleData.length - 1) * barSpacing + barSpacing / 2;
                const bottomY = paddingTop + chartHeight;
                const areaPath = `M ${firstX},${bottomY} L ${points} L ${lastX},${bottomY} Z`;

                return (
                  <>
                    <path d={areaPath} fill="url(#areaGradient)" />
                    <polyline
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth="2"
                      points={points}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                );
              })()}
            </g>
          )}

          {/* Chart Rendering: Line Mode */}
          {chartStyle === 'line' && visibleData.length > 0 && (
            <polyline
              fill="none"
              stroke="#2962ff"
              strokeWidth="2"
              points={visibleData
                .map((d, idx) => {
                  const x = idx * barSpacing + barSpacing / 2;
                  const y = priceToY(d.close);
                  return `${x},${y}`;
                })
                .join(' ')}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Chart Rendering: Candlestick Mode */}
          {chartStyle === 'candle' && (
            <g>
              {visibleData.map((d, idx) => {
                const x = idx * barSpacing + barSpacing / 2;
                const bodyX = idx * barSpacing + (barSpacing - barWidth) / 2;
                const yOpen = priceToY(d.open);
                const yClose = priceToY(d.close);
                const yHigh = priceToY(d.high);
                const yLow = priceToY(d.low);

                const isGreen = d.close >= d.open;
                const color = isGreen ? '#089981' : '#f23645';
                const bodyY = Math.min(yOpen, yClose);
                const bodyH = Math.max(1.5, Math.abs(yOpen - yClose));

                return (
                  <g key={`candle-${idx}`} className="transition-opacity">
                    {/* High/Low Wick */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    {/* Candle Body */}
                    <rect
                      x={bodyX}
                      y={bodyY}
                      width={barWidth}
                      height={bodyH}
                      fill={color}
                      rx={0.5}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 20 EMA Overlay */}
          {showEMA && (
            <polyline
              fill="none"
              stroke="#2962ff"
              strokeWidth="1.5"
              strokeDasharray="3 1"
              points={visibleData
                .map((_, idx) => {
                  const val = indicatorSeries.emaValues[idx];
                  if (val === null) return null;
                  const x = idx * barSpacing + barSpacing / 2;
                  const y = priceToY(val);
                  return `${x},${y}`;
                })
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* 50 SMA Overlay */}
          {showSMA && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              points={visibleData
                .map((_, idx) => {
                  const val = indicatorSeries.smaValues[idx];
                  if (val === null) return null;
                  const x = idx * barSpacing + barSpacing / 2;
                  const y = priceToY(val);
                  return `${x},${y}`;
                })
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* Active Crosshair Lines */}
          {hoverIndex !== null && visibleData[hoverIndex] && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={hoverIndex * barSpacing + barSpacing / 2}
                y1={paddingTop}
                x2={hoverIndex * barSpacing + barSpacing / 2}
                y2={paddingTop + chartHeight}
                stroke={isDark ? '#787b86' : '#94a3b8'}
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={0}
                y1={priceToY(visibleData[hoverIndex].close)}
                x2={chartWidth}
                y2={priceToY(visibleData[hoverIndex].close)}
                stroke={isDark ? '#787b86' : '#94a3b8'}
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Hover Price Tag on Y-axis */}
              <g transform={`translate(${chartWidth}, ${priceToY(visibleData[hoverIndex].close) - 10})`}>
                <rect
                  x="0"
                  y="0"
                  width={paddingRight}
                  height="20"
                  fill="#2962ff"
                  rx="2"
                />
                <text
                  x="6"
                  y="14"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {visibleData[hoverIndex].close.toFixed(2)}
                </text>
              </g>
            </g>
          )}

          {/* Live Current Price Pinned Line on Right Axis */}
          {visibleData.length > 0 && (
            <g>
              <line
                x1={0}
                y1={priceToY(price)}
                x2={chartWidth}
                y2={priceToY(price)}
                stroke={isUpTrend ? '#089981' : '#f23645'}
                strokeDasharray="4 4"
                strokeWidth="1"
                opacity="0.75"
              />
              <g transform={`translate(${chartWidth}, ${priceToY(price) - 10})`}>
                <rect
                  x="0"
                  y="0"
                  width={paddingRight}
                  height="20"
                  fill={isUpTrend ? '#089981' : '#f23645'}
                  rx="2"
                />
                <text
                  x="6"
                  y="14"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {price >= 1000
                    ? price.toFixed(1)
                    : price >= 1
                    ? price.toFixed(2)
                    : price.toFixed(4)}
                </text>
              </g>
            </g>
          )}

          {/* Y-axis Ticks (Prices) */}
          <g>
            {yTicks.map((val, idx) => {
              const y = priceToY(val);
              return (
                <text
                  key={`ytick-${idx}`}
                  x={chartWidth + 6}
                  y={y + 4}
                  fill={isDark ? '#787b86' : '#64748b'}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val >= 1000 ? val.toFixed(0) : val >= 1 ? val.toFixed(2) : val.toFixed(4)}
                </text>
              );
            })}
          </g>

          {/* X-axis Ticks (Dates) */}
          <g>
            {visibleData.map((d, idx) => {
              if (idx % 6 !== 0) return null;
              const x = idx * barSpacing + barSpacing / 2;
              return (
                <text
                  key={`xtick-${idx}`}
                  x={x}
                  y={paddingTop + chartHeight + 16}
                  fill={isDark ? '#787b86' : '#64748b'}
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {d.time}
                </text>
              );
            })}
          </g>
        </svg>

        {/* RSI Sub-pane if toggled */}
        {showRSI && (
          <div
            className={`absolute bottom-0 left-0 right-[68px] h-12 border-t px-2 flex items-center justify-between text-[10px] font-mono ${
              isDark ? 'bg-[#181b24]/90 border-[#2a2e39]' : 'bg-slate-50/90 border-[#e0e3eb]'
            }`}
          >
            <span className="text-purple-400 font-semibold">RSI 14</span>
            <div className="flex items-center gap-4 text-neutral-400">
              <span>70 (Overbought)</span>
              <span>50</span>
              <span>30 (Oversold)</span>
            </div>
            <span className="text-purple-300 font-bold">
              {indicatorSeries.rsiValues[hoverIndex ?? visibleData.length - 1] ?? 50}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
