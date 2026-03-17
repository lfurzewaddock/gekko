import { makeObservable, computed } from 'mobx';
import TOML, { type TomlTable } from 'smol-toml';
import humanizeDuration from 'humanize-duration';
import { getErrorMessage } from '#util/error';

import type { ContainerDefinition } from '#ioc';
import type { CandleSizeUnits } from '#page/Backtest/BacktestRepository';
import type { StrategyIdent } from '#core/domain/Strategy.ts';

export class BacktestFormPresenter {
  backtestRepository;

  handleStrategySelectChange = (strategy: string) => {
    this.backtestRepository.strategyActiveChangeHandler(
      strategy as StrategyIdent,
    );
  };

  handleHistorySizeChange = (historySize: string) => {
    this.backtestRepository.historySizeChangeHandler(
      Number.parseInt(historySize, 10),
    );
  };

  handleCandleSizeChange = (candleSize: string) => {
    const parsedCandleSize = Number.parseInt(candleSize, 10);
    this.backtestRepository.candleSizeChangeHandler(parsedCandleSize);
  };

  handleCandleSizeUnitChange = (unit: string) => {
    this.backtestRepository.candleSizeUnitChangeHandler(
      unit as CandleSizeUnits,
    );
  };

  constructor(opts: ContainerDefinition) {
    this.backtestRepository = opts.BacktestRepository;
    makeObservable(this, {
      viewModel: computed,
    });
  }

  get strategyParamsRecord(): Record<StrategyIdent, string> {
    if (!this.backtestRepository.strategyParams) {
      return {} as Record<StrategyIdent, string>;
    }
    return Object.fromEntries(
      this.backtestRepository.strategyParams.map((cur) => [
        cur.name,
        this.stringifyStrategyParams(cur.params),
      ]),
    ) as Record<StrategyIdent, string>;
  }

  get viewModel() {
    const strategyParams = this.strategyParamsRecord;
    return {
      strategyNames: this.backtestRepository.strategyParams?.map(
        ({ name }) => name,
      ),
      strategyParams,
      strategySelected: this.backtestRepository.strategySelected,
      strategySelectedParams:
        strategyParams == null
          ? ''
          : strategyParams[this.backtestRepository.strategySelected],
      candleSize: this.backtestRepository.candleSize,
      candleSizeUnits: this.backtestRepository.candleSizeUnits,
      candleSizeUnitSelected: this.backtestRepository.candleSizeUnit,
      historySize: this.backtestRepository.historySize,
      historySizeLegend: `Warmup period (in ${Number.isNaN(this.backtestRepository.candleSize) ? 0 : this.backtestRepository.candleSize} ${this.sliceLast(this.backtestRepository.candleSizeUnit)} candles)`,
      historySizeLabel: `(will use ${humanizeDuration(
        this.calcCandleSizeTotal(
          this.backtestRepository.candleSizeUnit,
          this.backtestRepository.candleSize,
        ) *
          this.backtestRepository.historySize *
          1000 *
          60,
      )} of data as history)`,
      parametersLegend: `${this.backtestRepository.strategySelected} Parameters`,
    };
  }

  stringifyStrategyParams = (toml: TomlTable) => {
    try {
      const stringifiedToml = TOML.stringify(toml);
      console.log('stringifiedToml', stringifiedToml);
      return stringifiedToml;
    } catch (e) {
      if (!(e instanceof Error)) {
        console.warn('error, not an error thrown', e);
        throw new Error('stringify TOML failed');
      }
      console.error('stringify TOML failed', getErrorMessage(e));
      return '';
    }
  };

  sliceLast = (unit: typeof this.backtestRepository.candleSizeUnit) => {
    return unit.slice(0, -1);
  };

  calcCandleSizeTotal = (
    unit: typeof this.backtestRepository.candleSizeUnit,
    candleSize: number,
  ) => {
    if (unit === 'hours') return candleSize * 60;
    if (unit === 'days') return candleSize * 60 * 24;
    return candleSize;
  };
}
