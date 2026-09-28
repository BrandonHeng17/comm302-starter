import React from 'react';
import { MarketCategory } from '../types';
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  Coins,
  ArrowLeftRight,
  Flame,
  Landmark,
  Grid,
  Filter,
  CalendarDays,
} from 'lucide-react';

interface MarketsSubnavProps {
  activeCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  isDark: boolean;
}

export const MarketsSubnav: React.FC<MarketsSubnavProps> = ({
  activeCategory,
  onSelectCategory,
  isDark,
}) => {
  const tabs: { id: MarketCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'indices', label: 'Indices', icon: TrendingUp },
    { id: 'stocks', label: 'Stocks', icon: PieChart },
    { id: 'crypto', label: 'Crypto', icon: Coins },
    { id: 'forex', label: 'Forex', icon: ArrowLeftRight },
    { id: 'futures', label: 'Futures', icon: Flame },
    { id: 'bonds', label: 'Bonds & Rates', icon: Landmark },
    { id: 'heatmap', label: 'Heatmap', icon: Grid },
    { id: 'screener', label: 'Screener', icon: Filter },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  ];

  return (
    <div
      className={`border-b transition-colors select-none ${
        isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? isDark
                      ? 'bg-[#2962ff] text-white shadow-sm'
                      : 'bg-[#2962ff] text-white shadow-sm'
                    : isDark
                    ? 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#f8f9fd]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'opacity-70'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
