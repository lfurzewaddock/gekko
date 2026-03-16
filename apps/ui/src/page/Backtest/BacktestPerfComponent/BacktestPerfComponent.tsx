import { observer } from 'mobx-react';
import clsx from 'clsx';

import { type BacktestPresenterVm } from '#page/Backtest/BacktestPresenter';

import SplitScreenComponent from '#component/layout/SplitScreenComponent';

function BactestPerfComponent({
  performanceReport,
  backtestingStatus,
}: {
  performanceReport: BacktestPresenterVm['performanceReport'];
  backtestingStatus: BacktestPresenterVm['backtestingStatus'];
}) {
  if (backtestingStatus === 'complete' && performanceReport) {
    const {
      startTime,
      endTime,
      timespan,
      startPrice,
      endPrice,
      market,
      trades,
      sharpe,
      startBalance,
      balance,
      relativeProfit,
      isNegativeProfit,
      isNegativeMarket,
    } = performanceReport;
    return (
      <>
        <h1 className="text-3xl/20">Backtest result</h1>
        <SplitScreenComponent className="md:justify-center">
          <div className="w-1/2 md:max-w-50 md:p-4">
            <div>START TIME</div>
            <div>END TIME</div>
            <div>TIMESPAN</div>
            <div>START PRICE</div>
            <div>END PRICE</div>
            <div>MARKET</div>
          </div>
          <div className="w-1/2 md:max-w-50 text-right md:p-4">
            <div className="md-text-right">{startTime}</div>
            <div className="md-text-right">{endTime}</div>
            <div className="md-text-right">{timespan}</div>
            <div className="md-text-right">{startPrice}</div>
            <div className="md-text-right">{endPrice}</div>
            <div
              className={clsx(
                {
                  'text-red-400': isNegativeMarket,
                  'text-green-400': !isNegativeMarket,
                },
                'md-text-right',
              )}
            >
              {market}
            </div>
          </div>
          <div className="w-1/2 md:max-w-72 md:p-4">
            <div>AMOUNT OF TRADES</div>
            <div>SHARPE RATIO</div>
            <div>START BALANCE</div>
            <div>FINAL BALANCE</div>
            <div>SIMULATED PROFIT</div>
          </div>
          <div className="w-1/2 md:max-w-50 text-right md:p-4">
            <div className="md-text-right">{trades}</div>
            <div className="md-text-right">{sharpe}</div>
            <div className="md-text-right">{startBalance}</div>
            <div className="md-text-right">{balance}</div>
            <div
              className={clsx(
                {
                  'text-red-400': isNegativeProfit,
                  'text-green-400': !isNegativeProfit,
                },
                'md-text-right text-xl/15 font-bold',
              )}
            >
              {relativeProfit}
            </div>
          </div>
        </SplitScreenComponent>
      </>
    );
  } else {
    return null;
  }
}

export default observer(BactestPerfComponent);
