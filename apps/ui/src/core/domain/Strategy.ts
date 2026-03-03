import { type TomlTable } from 'smol-toml';

export type StrategyIdent =
  | 'CCI'
  | 'DEBUG_single-advice'
  | 'DEBUG_toggle-advice'
  | 'DEMA'
  | 'MACD'
  | 'PPO'
  | 'RSI'
  | 'StochRSI'
  | 'TMA'
  | 'TSI'
  | 'UO'
  | 'custom'
  | 'noop'
  | 'talib-macd'
  | 'tulip-adx'
  | 'tulip-macd'
  | 'tulip-multi-strat'
  | 'varPPO';

export interface StrategyParam {
  name: StrategyIdent;
  params: TomlTable;
}
