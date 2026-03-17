import { makeObservable, computed } from 'mobx';
import { intervalToDuration, format, formatDuration } from 'date-fns';
import type { UTCDate } from '@date-fns/utc';
import humanizeDuration from 'humanize-duration';

import type { ContainerDefinition } from '#ioc';

export type BacktestPresenterVm = InstanceType<
  typeof BacktestPresenter
>['viewModel'];

type ScansetSelected = {
  exchange: string;
  currency: string;
  asset: string;
  from: UTCDate;
  to: UTCDate;
};

export class BacktestPresenter {
  backtestRepository;
  get viewModel() {
    return {
      scansets:
        this.backtestRepository.scansets?.flatMap((dataset) =>
          dataset.ranges.map((range) => {
            const dateTimeFormat = 'yyyy-MM-dd kk:mm';
            return {
              key: `${dataset.exchange}|${dataset.currency}|${dataset.asset}|${range.from.toISOString()}|${range.to.toISOString()}`,
              exchange: dataset.exchange,
              currency: dataset.currency,
              asset: dataset.asset,
              from: range.from,
              to: range.to,
              fromLabel: format(range.from, dateTimeFormat),
              toLabel: format(range.to, dateTimeFormat),
              duration: formatDuration(
                intervalToDuration({ start: range.from, end: range.to }),
                { delimiter: ', ' },
              ),
            };
          }),
        ) ?? [],
      isEnableBtnBackest: this.backtestRepository.scansetSelected != null,
      scansetSelected: this.backtestRepository.scansetSelected,
      performanceReport: this.preparePerfReport(),
      roundtripsReport: this.prepareRoundtripsReport(),
      backtestingStatus: this.backtestRepository.backtestingStatus,
    };
  }

  constructor(opts: ContainerDefinition) {
    this.backtestRepository = opts.BacktestRepository;
    makeObservable(this, {
      viewModel: computed,
    });
  }

  preparePerfReport = () => {
    if (
      this.backtestRepository.backtestStrategyReport?.performanceReport == null
    )
      return null;
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
    } = this.backtestRepository.backtestStrategyReport.performanceReport;
    const dateTimeFormat = 'yyyy-MM-dd kk:mm:ss';
    return {
      startTime: format(startTime, dateTimeFormat),
      endTime: format(endTime, dateTimeFormat),
      timespan,
      market: `${Number(market).toFixed(5)}%`,
      balance: Number(balance).toFixed(5),
      profit,
      relativeProfit: `${Number(relativeProfit).toFixed(5)}%`,
      yearlyProfit,
      relativeYearlyProfit,
      startPrice: Number(startPrice).toFixed(5),
      endPrice: Number(endPrice).toFixed(5),
      trades,
      startBalance: Number(startBalance).toFixed(5),
      exposure,
      sharpe: Number(sharpe).toFixed(2),
      downside,
      ratioRoundTrips,
      alpha,
      isNegativeProfit: relativeProfit < 0,
      isNegativeMarket: market < 0,
    };
  };

  prepareRoundtripsReport = () => {
    if (this.backtestRepository.backtestStrategyReport?.roundtrips == null)
      return null;

    return this.backtestRepository.backtestStrategyReport.roundtrips.map(
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
      }) => {
        const dateTimeFormat = 'yyyy-MM-dd kk:mm:ss';
        return {
          id,
          entryAt: format(entryAt, dateTimeFormat),
          entryPrice,
          entryBalance: Number(entryBalance).toFixed(3),
          exitAt: format(exitAt, dateTimeFormat),
          exitPrice,
          exitBalance: Number(exitBalance).toFixed(3),
          duration: humanizeDuration(duration),
          pnl: Number(Math.abs(pnl)).toFixed(2),
          profit: `${Number(profit).toFixed(2)}%`,
          isNegativePnl: pnl < 0,
          isNegativeProfit: profit < 0,
        };
      },
    );
  };

  handleScansetSelectChange = ({
    exchange,
    currency,
    asset,
    from,
    to,
  }: ScansetSelected) => {
    this.backtestRepository.scansetActiveChangeHandler({
      exchange,
      currency,
      asset,
      range: {
        from,
        to,
      },
    });
  };

  load = async () => {
    await this.backtestRepository.load();
  };

  submit = async () => {
    await this.backtestRepository.runBacktest();
  };
}
