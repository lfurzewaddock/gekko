import { makeObservable, observable, action } from 'mobx';
import TOML from 'smol-toml';
import { UTCDate } from '@date-fns/utc';
import { fromUnixTime, parse } from 'date-fns';

import { getErrorMessage } from '#util/error';
import { isObjEmpty } from '#util/index.ts';

import type { ContainerDefinition } from '#ioc';
import type { ScanSet, ScanSets } from '#core/domain/ScanSet.ts';
import type { StrategyParam, StrategyIdent } from '#core/domain/Strategy.ts';
import type { BacktestStrategyReport } from '#core/domain/Backtest.ts';

import type {
  BacktestResultResponseWithStrategy,
  BaseBacktestCfg,
  BacktestApiReqPayload,
  BacktestApiResPayload,
  DtoStrategyDataSet,
  ApiDtoScansets,
} from '#page/Backtest/BacktestDto';

const CANDLE_SIZE_UNITS = ['minutes', 'hours', 'days'] as const;
const STRAT_DEFAULT: StrategyIdent = 'MACD';
const CANDLE_SIZE_DEFAULT = 1;
const CANDLE_SIZE_UNIT_DEFAULT: CandleSizeUnits = 'hours';
const HISTORY_SIZE_DEFAULT = 10;
const MINUTES_PER_UNIT: Record<CandleSizeUnits, number> = {
  minutes: 1,
  hours: 60,
  days: 1440,
};

export type CandleSizeUnits = (typeof CANDLE_SIZE_UNITS)[number];

export class BacktestRepository {
  httpGateway;

  scansets: ScanSets[] | null = null;
  scansetSelected: ScanSet | null = null;
  strategyParams: StrategyParam[] | null = null;
  strategySelected = STRAT_DEFAULT;
  candleSizeUnits = CANDLE_SIZE_UNITS;
  candleSizeUnit = CANDLE_SIZE_UNIT_DEFAULT;
  candleSize = CANDLE_SIZE_DEFAULT;
  // _candleSizeMinutes =
  //   CANDLE_SIZE_DEFAULT * MINUTES_PER_UNIT[CANDLE_SIZE_UNIT_DEFAULT];
  historySize = HISTORY_SIZE_DEFAULT;
  backtestStrategyReport: BacktestStrategyReport<
    typeof this.strategySelected
  > | null = null;

  constructor(opts: ContainerDefinition) {
    this.httpGateway = opts.HttpGateway;
    makeObservable(this, {
      scansets: observable,
      strategySelected: observable,
      strategyParams: observable,
      scansetSelected: observable,
      historySize: observable,
      candleSize: observable,
      candleSizeUnit: observable,
      backtestStrategyReport: observable,
      scansetActiveChangeHandler: action,
      strategyActiveChangeHandler: action,
      historySizeChangeHandler: action,
      candleSizeChangeHandler: action,
      candleSizeUnitChangeHandler: action,
    });
    this.reset();
  }

  scansetActiveChangeHandler = (scanSet: ScanSet) => {
    this.scansetSelected = scanSet;
  };

  strategyActiveChangeHandler = (strategy: StrategyIdent) => {
    this.strategySelected = strategy;
  };

  historySizeChangeHandler = (historySize: number) => {
    this.historySize = historySize;
  };

  candleSizeChangeHandler = (candleSize: number) => {
    this.candleSize = candleSize;
  };

  candleSizeUnitChangeHandler = (unit: CandleSizeUnits) => {
    this.candleSizeUnit = unit;
  };

  reset = () => {
    this.scansets = [];
    this.strategyParams = [];
    this.historySize = HISTORY_SIZE_DEFAULT;
    this.candleSize = CANDLE_SIZE_DEFAULT;
    this.candleSizeUnit = CANDLE_SIZE_UNIT_DEFAULT;
  };

  calcCandleSizeMinutes = () => {
    return this.candleSize * MINUTES_PER_UNIT[this.candleSizeUnit];
  };

  parseStrategyParams = (toml: string) => {
    try {
      const parsedToml = TOML.parse(toml);
      return parsedToml;
    } catch (e) {
      if (!(e instanceof Error)) {
        console.warn('error, not an error thrown', e);
        throw new Error("parse TOML from '/strategies' API EP failed");
      }
      console.error(
        "parse TOML from '/strategies' API EP failed",
        getErrorMessage(e),
      );
      return {};
    }
  };

  lookupStrategyParams = (strategy: StrategyIdent) => {
    return this.strategyParams?.find((s) => s.name === strategy)?.params;
  };

  validateCfg = (cfg: BacktestApiReqPayload) => {
    if (!cfg.backtest) return false;
    if (!cfg.backtest.daterange) return false;
    if (isObjEmpty(cfg.backtest.daterange)) return false;
    if (!cfg.watch) return false;
    if (!cfg.tradingAdvisor) return false;
    if (
      Number.isNaN(cfg.tradingAdvisor.candleSize) ||
      cfg.tradingAdvisor.candleSize == 0
    )
      return false;

    const strat = cfg.tradingAdvisor.method;
    if (isObjEmpty(cfg[strat])) return false;

    return true;
  };

  strategyParamMapper = <T extends StrategyIdent>(
    strategy: T,
    params: BacktestResultResponseWithStrategy<T>['strategyParameters'],
  ): BacktestStrategyReport<T>['strategyParameters'] => {
    switch (strategy) {
      case 'MACD': {
        const { short, long, signal, thresholds } =
          params as BacktestResultResponseWithStrategy<'MACD'>['strategyParameters'];
        const { down, up, persistence } = thresholds;

        return {
          short,
          long,
          signal,
          thresholds: {
            down,
            up,
            persistence,
          },
        } as BacktestStrategyReport<T>['strategyParameters'];
      }
      case 'RSI': {
        const { interval, thresholds } =
          params as BacktestResultResponseWithStrategy<'RSI'>['strategyParameters'];
        const { low, high, persistence } = thresholds;

        return {
          interval,
          thresholds: {
            low,
            high,
            persistence,
          },
        } as BacktestStrategyReport<T>['strategyParameters'];
      }
      default:
        return params as BacktestStrategyReport<T>['strategyParameters'];
    }
  };

  transformBacktestReportApiDto = <
    T extends StrategyIdent = typeof this.strategySelected,
  >(
    apiPayload: BacktestResultResponseWithStrategy<T>,
  ): BacktestStrategyReport<T> => {
    const { exchange, currency, asset } = apiPayload.market;
    const { enabled, method, candleSize, historySize } =
      apiPayload.tradingAdvisor;
    const {
      startTime,
      endTime,
      timespan,
      market,
      balance,
      profit,
      relativeProfit,
      yearlyProfit,
      relativeYearlyProfit,
      startPrice,
      endPrice,
      trades,
      startBalance,
      exposure,
      sharpe,
      downside,
      ratioRoundTrips,
      alpha,
    } = apiPayload.performanceReport;

    return {
      market: {
        exchange,
        currency,
        asset,
      },
      tradingAdvisor: {
        isEnabled: enabled,
        method,
        candleSize,
        historySize,
      },
      strategyParameters: this.strategyParamMapper(
        method,
        apiPayload.strategyParameters,
      ),
      performanceReport: {
        startTime: parse(startTime, 'yyyy-MM-dd HH:mm:ss', new UTCDate()),
        endTime: parse(endTime, 'yyyy-MM-dd HH:mm:ss', new UTCDate()),
        timespan,
        market,
        balance,
        profit,
        relativeProfit,
        yearlyProfit,
        relativeYearlyProfit,
        startPrice,
        endPrice,
        trades,
        startBalance,
        exposure,
        sharpe,
        downside,
        ratioRoundTrips,
        alpha,
      },
      roundtrips: apiPayload.roundtrips.map(
        ({
          id,
          entryAt,
          entryPrice,
          entryBalance,
          exitAt,
          exitPrice,
          exitBalance,
          duration,
          pnl,
          profit,
        }) => ({
          id,
          entryAt,
          entryPrice,
          entryBalance,
          exitAt,
          exitPrice,
          exitBalance,
          duration,
          pnl,
          profit,
        }),
      ),
      stratCandles: apiPayload.stratCandles.map(({ open, start }) => ({
        open,
        start: new UTCDate(fromUnixTime(start)),
      })),
      trades: apiPayload.trades.map(
        ({
          id,
          adviceId,
          action,
          cost,
          amount,
          price,
          portfolio,
          balance,
          date,
          effectivePrice,
          feePercent,
        }) => {
          const { asset, currency } = portfolio;
          return {
            id,
            adviceId,
            action,
            cost,
            amount,
            price,
            portfolio: {
              asset,
              currency,
            },
            balance,
            date: new UTCDate(fromUnixTime(date)),
            effectivePrice,
            feePercent,
          };
        },
      ),
    };
  };

  load = async () => {
    const { signal } = new AbortController();
    const apiCalls = [
      this.httpGateway.post<Record<never, never>, ApiDtoScansets>(
        '/scansets',
        { signal },
        {},
      ),
      this.httpGateway.get<DtoStrategyDataSet[]>('/strategies', { signal }),
    ];

    const [scansetsDto, strategyParamsDto] = (await Promise.allSettled(
      apiCalls,
    )) as [
      PromiseSettledResult<ApiDtoScansets>,
      PromiseSettledResult<DtoStrategyDataSet<StrategyIdent>[]>,
    ];

    if (scansetsDto.status === 'fulfilled') {
      this.scansets = scansetsDto.value.datasets.map((scansetDto) => ({
        exchange: scansetDto.exchange,
        currency: scansetDto.currency,
        asset: scansetDto.asset,
        ranges: scansetDto.ranges.map((range) => ({
          from: new UTCDate(fromUnixTime(range.from)),
          to: new UTCDate(fromUnixTime(range.to)),
        })),
      }));
    } else {
      // TODO - handle status rejected with property reason
    }

    if (strategyParamsDto.status === 'fulfilled') {
      this.strategyParams = strategyParamsDto.value.map((strategyParamDto) => ({
        name: strategyParamDto.name as StrategyIdent,
        params: this.parseStrategyParams(strategyParamDto.params),
      }));
    } else {
      // TODO - handle status rejected with property reason
    }
  };

  // TODO - handle errors
  post = async (backtestCfg: BacktestApiReqPayload) => {
    const { signal } = new AbortController();
    const backtestApiResPayload = await this.httpGateway.post<
      BacktestApiReqPayload,
      BacktestApiResPayload
    >('/backtest', { signal }, backtestCfg);
    this.backtestStrategyReport = this.transformBacktestReportApiDto(
      backtestApiResPayload,
    );
  };

  runBacktest = async () => {
    if (this.scansetSelected == null) throw new Error('no scanset selected!');
    const backtestCfgBase: Omit<
      BaseBacktestCfg,
      'watch' | 'backtest' | 'tradingAdvisor'
    > = {
      paperTrader: {
        // TODO: get from API TOML
        feeMaker: 0.25,
        feeTaker: 0.25,
        feeUsing: 'maker',
        slippage: 0.05,
        simulationBalance: {
          asset: 1,
          currency: 100,
        },
        reportRoundtrips: true,
        enabled: true,
      },
      backtestResultExporter: {
        enabled: true,
        writeToDisk: false,
        data: {
          stratUpdates: false,
          roundtrips: true,
          stratCandles: true,
          stratCandleProps: ['open'],
          trades: true,
        },
      },
      performanceAnalyzer: {
        // TODO: get from API TOML
        riskFreeReturn: 2,
        enabled: true,
      },
      valid: false,
    };
    // build payload
    const backtestCfg: BacktestApiReqPayload = {
      [this.strategySelected]: this.lookupStrategyParams(this.strategySelected),
      ...backtestCfgBase,
      watch: {
        exchange: this.scansetSelected.exchange,
        currency: this.scansetSelected.currency,
        asset: this.scansetSelected.asset,
      },
      backtest: {
        daterange: {
          from: this.scansetSelected.range.from.toISOString(),
          to: this.scansetSelected.range.to.toISOString(),
        },
      },
      tradingAdvisor: {
        enabled: true, // why/how would this be false?
        method: this.strategySelected,
        candleSize: this.calcCandleSizeMinutes(),
        historySize: this.historySize,
      },
    };

    backtestCfg.valid = this.validateCfg(backtestCfg);

    this.post(backtestCfg);
  };
}
