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
interface StratThresholdsCCI {
  up: number;
  down: number;
  persistence: number;
}

interface StratCfgCCI {
  constant: 0.015;
  history: 90;
  thresholds: StratThresholdsCCI;
}

interface StratThresholdsDEMA {
  up: number;
  down: number;
}

interface StratCfgDEMA {
  weight: number;
  thresholds: StratThresholdsDEMA;
}

interface StratThresholdsMACD {
  down: number;
  up: number;
  persistence: number;
}

interface StratCfgPPO extends StratCfgMACD {}
interface StratCfgMACD {
  short: number;
  long: number;
  signal: number;
  thresholds: StratThresholdsMACD;
}

interface StratThresholdsTSI extends StratThresholdsRSI {}
interface StratThresholdsUO extends StratThresholdsRSI {}
interface StratThresholdsRSI {
  low: number;
  high: number;
  persistence: number;
}

interface StratCfgStochRSI extends StratCfgRSI {}
interface StratCfgRSI {
  interval: number;
  thresholds: StratThresholdsRSI;
}

interface StratCfgTMA {
  short: number;
  medium: number;
  long: number;
}

interface StratCfgTSI {
  short: number;
  long: number;
  thresholds: StratThresholdsTSI;
}

interface StratStageUO {
  weight: number;
  period: number;
}

interface StratCgfUO {
  first: StratStageUO;
  second: StratStageUO;
  third: StratStageUO;
  thresholds: StratThresholdsUO;
}

interface StratCfgCustom {
  my_custom_setting: number;
}

interface StratNone {}

interface StratThresholdsTulipMACD extends StratThresholdsTalibMACD {}
interface StratThresholdsTulipADX extends StratThresholdsTalibMACD {}
interface StratThresholdsTalibMACD {
  down: number;
  up: number;
}

interface StratParamsTulipMACD extends StratParamsTalibMACD {}
interface StratParamsTalibMACD {
  optInFastPeriod: number;
  optInSlowPeriod: number;
  optInSignalPeriod: number;
}
interface StratCfgTalibMACD {
  parameters: StratParamsTalibMACD;
  thresholds: StratThresholdsTalibMACD;
}

interface StratCfgTulipADX {
  historySize: number;
  optInTimePeriod: number;
  candleSize: number;
  thresholds: StratThresholdsTulipADX;
}

interface StratCfgTulipMACD {
  parameters: StratParamsTulipMACD;
  thresholds: StratThresholdsTulipMACD;
}

interface StratCfgTulipMultiStrat {
  optInTimePeriod: number;
  optInFastPeriod: number;
  optInSlowPeriod: number;
  optInSignalPeriod: number;
  candleSize: number;
  historySize: number;
  up: number;
  down: number;
  macd_up: number;
  macd_down: number;
}

interface StratThresholdsVarPPO {
  weightLow: number;
  weightHigh: number;
  persistence: number;
}

interface StratCfgVarPPO {
  momentum: 'TSI' | 'RSI' | 'UO';
  thresholds: StratThresholdsVarPPO;
}

export interface StrategyCfgMap {
  CCI: StratCfgCCI;
  'DEBUG_single-advice': StratNone;
  'DEBUG_toggle-advice': StratNone;
  DEMA: StratCfgDEMA;
  MACD: StratCfgMACD;
  PPO: StratCfgPPO;
  RSI: StratCfgRSI;
  StochRSI: StratCfgStochRSI;
  TMA: StratCfgTMA;
  TSI: StratCfgTSI;
  UO: StratCgfUO;
  custom: StratCfgCustom;
  noop: StratNone;
  'talib-macd': StratCfgTalibMACD;
  'tulip-adx': StratCfgTulipADX;
  'tulip-macd': StratCfgTulipMACD;
  'tulip-multi-strat': StratCfgTulipMultiStrat;
  varPPO: StratCfgVarPPO;
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

export interface BacktestResultResponseWithStrategy<
  T extends keyof StrategyCfgMap,
> {
  market: Market;
  tradingAdvisor: TradingAdvisorConfig & { method: T };
  strategyParameters: StrategyCfgMap[T];
  performanceReport: PerformanceReport;
  roundtrips: Roundtrip[];
  stratCandles: StratCandle[];
  trades: Trade[];
}

export type BacktestApiResPayload = BacktestResultResponseWithStrategy<
  keyof StrategyCfgMap
>;
