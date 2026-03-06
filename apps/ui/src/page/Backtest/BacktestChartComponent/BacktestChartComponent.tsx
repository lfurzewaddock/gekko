import { fromUnixTime, format } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

import {
  RoundtripLineChartComponent,
  type ChartData,
} from '#component/chart/RoundtripLineChartComponent.tsx';

import { type BacktestPresenterVm } from '#page/Backtest/BacktestPresenter';

function BacktestFormComponent({
  children,
}: {
  children: BacktestPresenterVm['chartData'];
}) {
  const mergeChartData = (
    candles: { start: number; open: number }[],
    trades: {
      id: string;
      adviceId: string;
      action: 'buy' | 'sell';
      cost: number;
      amount: number;
      price: number;
      portfolio: {
        asset: number;
        currency: number;
      };
      balance: number;
      date: number; // Unix timestamp
      effectivePrice: number;
      feePercent: number;
    }[],
  ): ChartData[] => {
    const tradeMap = new Map(trades.map((ind) => [ind.date, ind]));
    return candles.map(({ start, open }) => {
      const candle = {
        date: new UTCDate(fromUnixTime(start)),
        open,
      };
      const tradeByDate = tradeMap.get(start);
      if (tradeByDate) {
        return {
          ...candle,
          trade: {
            date: new UTCDate(fromUnixTime(tradeByDate.date)),
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

  const mergedChartData = mergeChartData(
    children?.stratCandles || [],
    children?.trades || [],
  );

  const tickFormat = (tick: number | Date) => {
    const formatFn = (d: Date) => format(d, 'dd LLL').toLocaleUpperCase();
    if (typeof tick === 'number') {
      return formatFn(mergedChartData[tick].date);
    }
    return formatFn(tick);
  };

  return (
    <div
      className="relative w-screen ml-[50%] -translate-x-1/2"
      style={{
        width: 'calc(100vw - 15px)',
      }}
    >
      <div className="absolute bg-gray-400 opacity-10 cursor-zoom-in top-0 bottom-0 left-0 right-0"></div>
      <RoundtripLineChartComponent
        data={mergedChartData}
        tickFormat={tickFormat}
        margin={{ left: 60, right: 5, bottom: 40, top: 5 }}
        ctxBrushStrokeStyle="#2563eb"
        ctxLineStrokeStyle="#2563eb"
        ctxBrushFillStyle="rgba(37, 99, 235, 0.18)"
        ctxBrushMinSelectionSize={5}
        ctxXAxisShowGridLines
      />
    </div>
  );
}

export default BacktestFormComponent;
