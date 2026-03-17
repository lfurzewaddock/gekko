import { format, getUnixTime } from 'date-fns';
import { makeObservable, computed } from 'mobx';

import type { ContainerDefinition } from '#ioc';
import { type ChartData } from '#component/chart/RoundtripLineChartComponent.tsx';

import type { StratCandle, Trade } from '#core/domain/Backtest';

export class BacktestChartPresenter {
  backtestRepository;
  get viewModel() {
    return {
      chartData: this.mergeChartData(
        this.backtestRepository.backtestStrategyReport?.stratCandles || [],
        this.backtestRepository.backtestStrategyReport?.trades || [],
      ),
    };
  }
  get cfg() {
    return {
      isDisplayTradeTooltip: true,
      ctxBrushStrokeStyle: '#2563eb',
      ctxLineStrokeStyle: '#2563eb',
      ctxBrushFillStyle: 'rgba(37, 99, 235, 0.18)',
      ctxBrushMinSelectionSize: 5,
      ctxXAxisHasGridLines: true,
      focusChartMargin: { left: 60, right: 5, bottom: 40, top: 5 },
      focusChartXAxisHasGridLines: true,
    };
  }

  constructor(opts: ContainerDefinition) {
    this.backtestRepository = opts.BacktestRepository;
    makeObservable(this, {
      viewModel: computed,
    });
  }

  mergeChartData = (candles: StratCandle[], trades: Trade[]): ChartData[] => {
    const tradeMap = new Map(trades.map((ind) => [getUnixTime(ind.date), ind]));
    return candles.map(({ start, open }) => {
      const candle = {
        date: start,
        open,
      };
      const tradeByDate = tradeMap.get(getUnixTime(start));
      if (tradeByDate) {
        return {
          ...candle,
          trade: {
            date: tradeByDate.date,
            price: tradeByDate.price,
            action: tradeByDate.action,
          },
        };
      }
      return {
        ...candle,
        trade: null,
      };
    });
  };

  tickFormat = (tick: number | Date) => {
    const formatFn = (d: Date) => format(d, 'dd LLL').toLocaleUpperCase();
    if (typeof tick === 'number') {
      return formatFn(this.viewModel.chartData[tick].date);
    }
    return formatFn(tick);
  };

  tradeMarkerFill = (action?: 'buy' | 'sell') => {
    if (action === 'buy') return '#16a34a';
    if (action === 'sell') return '#dc2626';
    return 'none';
  };

  formatTradeTooltipTxt = (trade: NonNullable<ChartData['trade']>): string => {
    return `${trade.action.charAt(0).toUpperCase()}${trade.action.slice(1)} @ ${trade.price}`;
  };
}
