export interface DtoStrategyDataSet<T = string> {
  name: T;
  params: string;
}
interface DtoScanDataset {
  exchange: string;
  currency: string;
  asset: string;
  ranges: {
    from: number;
    to: number;
  }[];
}

export interface ApiDtoScansets {
  datasets: DtoScanDataset[];
  errors: Pick<DtoScanDataset, 'exchange' | 'currency' | 'asset'>[];
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
  enabled: boolean;
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

interface SimulationBalance {
  asset: number;
  currency: number;
}

interface PaperTraderConfig {
  feeMaker: number;
  feeTaker: number;
  feeUsing: 'maker' | 'taker';
  slippage: number;
  simulationBalance: SimulationBalance;
  reportRoundtrips: boolean;
  enabled: boolean;
}

interface DateRange {
  from: string;
  to: string;
}

interface BacktestSettings {
  daterange: DateRange;
}

interface BacktestResultExporterData {
  stratUpdates: boolean;
  roundtrips: boolean;
  stratCandles: boolean;
  stratCandleProps: string[];
  trades: boolean;
}

interface BacktestResultExporterConfig {
  enabled: boolean;
  writeToDisk: boolean;
  data: BacktestResultExporterData;
}

interface PerformanceAnalyzerConfig {
  riskFreeReturn: number;
  enabled: boolean;
}

export interface BaseBacktestCfg {
  watch: Market;
  paperTrader: PaperTraderConfig;
  tradingAdvisor: TradingAdvisorConfig;
  backtest: BacktestSettings;
  backtestResultExporter: BacktestResultExporterConfig;
  performanceAnalyzer: PerformanceAnalyzerConfig;
  valid: boolean;
}

type BacktestCfg = BaseBacktestCfg & {
  [K in keyof StrategyCfgMap]?: StrategyCfgMap[K];
};

export type BacktestApiReqPayload = BacktestCfg;

// API Response

// ============================================
// Performance Report
// ============================================
interface PerformanceReport {
  startTime: string;
  endTime: string;
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
  ratioRoundTrips: string;
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
interface StratCandle {
  open: number;
  start: number; // Unix timestamp
}

// ============================================
// Trade
// ============================================
interface TradePortfolio {
  asset: number;
  currency: number;
}

interface Trade {
  id: string;
  adviceId: string;
  action: 'buy' | 'sell';
  cost: number;
  amount: number;
  price: number;
  portfolio: TradePortfolio;
  balance: number;
  date: number; // Unix timestamp
  effectivePrice: number;
  feePercent: number;
}

interface BacktestResultResponseWithStrategy<T extends keyof StrategyCfgMap> {
  market: Market;
  tradingAdvisor: TradingAdvisorConfig & { method: T };
  strategyParameters: StrategyCfgMap[T];
  performanceReport: PerformanceReport;
  roundtrips: Roundtrip[];
  stratCandles: StratCandle[];
  trades: Trade[];
}

export type BacktestApiResPayload =
  | BacktestResultResponseWithStrategy<'MACD'>
  | BacktestResultResponseWithStrategy<'RSI'>;
