import React, { useState } from 'react';
import { ECONOMIC_EVENTS } from '../data/economicCalendar';
import { Calendar, Filter, Globe } from 'lucide-react';

interface EconomicCalendarViewProps {
  isDark: boolean;
}

export const EconomicCalendarView: React.FC<EconomicCalendarViewProps> = ({ isDark }) => {
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');

  const filteredEvents = ECONOMIC_EVENTS.filter(e => {
    if (impactFilter !== 'All' && e.impact !== impactFilter) return false;
    if (countryFilter !== 'All' && e.countryCode !== countryFilter) return false;
    return true;
  });

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#ffffff] border-[#e0e3eb]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2962ff]" />
            <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Economic Calendar
            </h2>
          </div>
          <p className={`text-xs ${isDark ? 'text-[#787b86]' : 'text-neutral-500'}`}>
            Global macroeconomic data releases, central bank decisions, and leading indicators
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Impact Filter */}
          <div
            className={`flex items-center p-0.5 rounded border text-xs ${
              isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#f0f3fa] border-[#e0e3eb]'
            }`}
          >
            {(['All', 'High', 'Medium', 'Low'] as const).map(imp => (
              <button
                key={imp}
                onClick={() => setImpactFilter(imp)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  impactFilter === imp
                    ? 'bg-[#2962ff] text-white font-medium'
                    : isDark
                    ? 'text-[#787b86] hover:text-white'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {imp === 'All' ? 'All Impacts' : `${imp} Impact`}
              </button>
            ))}
          </div>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className={`px-2.5 py-1.5 rounded border text-xs outline-none ${
              isDark
                ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
                : 'bg-white border-[#e0e3eb] text-neutral-800'
            }`}
          >
            <option value="All">All Countries</option>
            <option value="US">🇺🇸 United States</option>
            <option value="EU">🇪🇺 Eurozone</option>
            <option value="GB">🇬🇧 United Kingdom</option>
            <option value="JP">🇯🇵 Japan</option>
            <option value="CN">🇨🇳 China</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className={`border-b text-[11px] font-medium ${
                isDark ? 'bg-[#181b24] border-[#2a2e39] text-[#787b86]' : 'bg-[#f8f9fd] border-[#e0e3eb] text-neutral-500'
              }`}
            >
              <th className="py-2.5 px-4 font-normal">Time (GMT)</th>
              <th className="py-2.5 px-4 font-normal">Country</th>
              <th className="py-2.5 px-4 font-normal text-center">Impact</th>
              <th className="py-2.5 px-4 font-normal">Event</th>
              <th className="py-2.5 px-4 font-normal text-center">Period</th>
              <th className="py-2.5 px-4 font-normal text-right">Actual</th>
              <th className="py-2.5 px-4 font-normal text-right">Forecast</th>
              <th className="py-2.5 px-4 font-normal text-right">Prior</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-[#2a2e39]' : 'divide-[#e0e3eb]'}`}>
            {filteredEvents.map(event => (
              <tr key={event.id} className={isDark ? 'hover:bg-[#252936]' : 'hover:bg-[#f8f9fd]'}>
                <td className="py-3 px-4 font-mono text-neutral-400 whitespace-nowrap">
                  {event.time}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="mr-1.5 text-sm">{event.flag}</span>
                  <span className="font-semibold text-white">{event.countryCode}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      event.impact === 'High'
                        ? 'bg-[#f23645]/15 text-[#f23645]'
                        : event.impact === 'Medium'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-neutral-500/15 text-neutral-400'
                    }`}
                  >
                    <span className="flex gap-0.5">
                      <span className="w-1 h-2 rounded-xs bg-current"></span>
                      <span className={`w-1 h-2 rounded-xs ${event.impact === 'Low' ? 'opacity-20' : 'bg-current'}`}></span>
                      <span className={`w-1 h-2 rounded-xs ${event.impact !== 'High' ? 'opacity-20' : 'bg-current'}`}></span>
                    </span>
                    {event.impact}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-white">
                  {event.title}
                </td>
                <td className="py-3 px-4 text-center font-mono text-neutral-400">
                  {event.period}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-white">
                  {event.actual !== null ? (
                    <span className="text-[#089981]">{event.actual}</span>
                  ) : (
                    <span className="text-neutral-500">Upcoming</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-300">
                  {event.forecast}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-400">
                  {event.prior}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
