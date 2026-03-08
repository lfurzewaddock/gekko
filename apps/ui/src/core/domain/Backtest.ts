import { UTCDate } from '@date-fns/utc';

type TradeAction = 'buy' | 'sell';

export interface StratCandleTrade {
  date: UTCDate;
  open: number;
  trade: { date: UTCDate; price: number; action: TradeAction } | null;
}

// ============================================
// Market Configuration
// ============================================
interface Market {
  exchange: string;
  currency: string;
  asset: string;
}

// ============================================
// Trading Advisor Configuration
// ============================================
interface TradingAdvisorConfig {
  isEnabled: boolean;
  method: keyof StrategyCfgMap;
  candleSize: number;
  historySize: number;
}

// ============================================
// Strategy Configs
// ============================================
interface StratUnknown {}

interface StratThresholdsRSI {
  low: number;
  high: number;
  persistence: number;
}

interface StratCfgRSI {
  interval: number;
  thresholds: StratThresholdsRSI;
}

interface StratThresholdsMACD {
  down: number;
  up: number;
  persistence: number;
}

interface StratCfgMACD {
  short: number;
  long: number;
  signal: number;
  thresholds: StratThresholdsMACD;
}

export interface StrategyCfgMap {
  CCI: StratUnknown;
  'DEBUG_single-advice': StratUnknown;
  'DEBUG_toggle-advice': StratUnknown;
  DEMA: StratUnknown;
  MACD: StratCfgMACD;
  PPO: StratUnknown;
  RSI: StratCfgRSI;
  StochRSI: StratUnknown;
  TMA: StratUnknown;
  TSI: StratUnknown;
  UO: StratUnknown;
  custom: StratUnknown;
  noop: StratUnknown;
  'talib-macd': StratUnknown;
  'tulip-adx': StratUnknown;
  'tulip-macd': StratUnknown;
  'tulip-multi-strat': StratUnknown;
  varPPO: StratUnknown;
}

// ============================================
// Performance Report
// ============================================
interface PerformanceReport {
  startTime: UTCDate;
  endTime: UTCDate;
  timespan: string;
  market: number;
  balance: number;
  profit: number;
  relativeProfit: number;
  yearlyProfit: number;
  relativeYearlyProfit: number;
  startPrice: number;
  endPrice: number;
  trades: number;
  startBalance: number;
  exposure: number;
  sharpe: number;
  downside: number;
  ratioRoundTrips: string; // numeric string: example: '37.1795' investigate why this is a string: perhaps to avoid rounding errors from floating-point math
  alpha: number;
}

// ============================================
// Roundtrip
// ============================================
interface Roundtrip {
  id: number;
  entryAt: number; // Unix timestamp
  entryPrice: number;
  entryBalance: number;
  exitAt: number; // Unix timestamp
  exitPrice: number;
  exitBalance: number;
  duration: number; // Duration in milliseconds
  pnl: number; // Profit and Loss
  profit: number;
}

// ============================================
// Strategy Candle
// ============================================
export interface StratCandle {
  open: number;
  start: UTCDate;
}

// ============================================
// Trade
// ============================================
interface TradePortfolio {
  asset: number;
  currency: number;
}

export interface Trade {
  id: string;
  adviceId: string;
  action: TradeAction;
  cost: number;
  amount: number;
  price: number;
  portfolio: TradePortfolio;
  balance: number;
  date: UTCDate;
  effectivePrice: number;
  feePercent: number;
}

export interface BacktestStrategyReport<T extends keyof StrategyCfgMap> {
  market: Market;
  tradingAdvisor: TradingAdvisorConfig & { method: T };
  strategyParameters: StrategyCfgMap[T];
  performanceReport: PerformanceReport;
  roundtrips: Roundtrip[];
  stratCandles: StratCandle[];
  trades: Trade[];
}
