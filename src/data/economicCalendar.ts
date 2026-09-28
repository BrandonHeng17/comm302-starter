import { EconomicEvent } from '../types';

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'ev-1',
    time: '13:30 GMT',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    title: 'Core CPI (MoM)',
    impact: 'High',
    actual: '0.3%',
    forecast: '0.2%',
    prior: '0.3%',
    period: 'Sep'
  },
  {
    id: 'ev-2',
    time: '13:30 GMT',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    title: 'Initial Jobless Claims',
    impact: 'High',
    actual: '241K',
    forecast: '260K',
    prior: '258K',
    period: 'Oct 12'
  },
  {
    id: 'ev-3',
    time: '12:15 GMT',
    country: 'Eurozone',
    countryCode: 'EU',
    flag: '🇪🇺',
    title: 'ECB Deposit Facility Rate',
    impact: 'High',
    actual: '3.25%',
    forecast: '3.25%',
    prior: '3.50%',
    period: 'Oct'
  },
  {
    id: 'ev-4',
    time: '06:00 GMT',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    title: 'Monthly GDP (MoM)',
    impact: 'Medium',
    actual: '0.2%',
    forecast: '0.2%',
    prior: '0.0%',
    period: 'Aug'
  },
  {
    id: 'ev-5',
    time: '01:30 GMT',
    country: 'China',
    countryCode: 'CN',
    flag: '🇨🇳',
    title: 'Industrial Production (YoY)',
    impact: 'High',
    actual: '5.4%',
    forecast: '4.6%',
    prior: '4.5%',
    period: 'Sep'
  },
  {
    id: 'ev-6',
    time: '14:00 GMT',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    title: 'FOMC Member Speech (Waller)',
    impact: 'Medium',
    actual: null,
    forecast: '-',
    prior: '-',
    period: '-'
  },
  {
    id: 'ev-7',
    time: '18:00 GMT',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    title: 'Federal Reserve Beige Book',
    impact: 'Medium',
    actual: null,
    forecast: '-',
    prior: '-',
    period: 'Oct'
  },
  {
    id: 'ev-8',
    time: '23:30 GMT',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    title: 'National Core CPI (YoY)',
    impact: 'High',
    actual: '2.5%',
    forecast: '2.5%',
    prior: '2.8%',
    period: 'Sep'
  }
];
