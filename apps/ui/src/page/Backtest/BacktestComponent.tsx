import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useDependency } from '#core/hooks/use-dependency';

import type { ContainerDefinition } from '#ioc';
import BacktestFormComponent from '#page/Backtest/BacktestForm/BacktestFormComponent.tsx';
import BacktestChartComponent from '#page/Backtest/BacktestChart/BacktestChartComponent.tsx';
import BacktestPerfComponent from '#page/Backtest/BacktestPerf/BacktestPerfComponent.tsx';
import ScansetTableComponent from '#page/Backtest/ScansetTableComponent';
import BacktestRoundtripsComponent from '#page/Backtest/BacktestRoundtrips/BacktestRoundtripsComponent';
import { MessagesComponent } from '#core/Messages/MessagesComponent';

function PageBacktest() {
  const presenter = useDependency<ContainerDefinition['BacktestPresenter']>('BacktestPresenter');

  useEffect(() => {
    return () => {
      presenter.dispose?.();
    };
  }, [presenter]);

  return (
    <>
      <h1 className="text-5xl/20">Backtest</h1>
      <ScansetTableComponent presenter={presenter}>
        {presenter.viewModel.scansets}
      </ScansetTableComponent>
      <BacktestFormComponent />
      <BacktestPerfComponent
        performanceReport={presenter.viewModel.performanceReport}
        backtestingStatus={presenter.viewModel.backtestingStatus}
      />
      <BacktestChartComponent />
      <BacktestRoundtripsComponent>
        {presenter.viewModel.roundtripsReport}
      </BacktestRoundtripsComponent>
      {/* <div>
        <h2>IoC Container Registration(s)</h2>
        <pre>{JSON.stringify(container.registrations, null, 2)}</pre>
      </div> */}
      <div className="fixed bottom-5 inset-e-5 flex flex-row gap-2 z-50 items-center h-[50]">
        <MessagesComponent />
        <button
          disabled={!presenter.viewModel.isEnableBtnBackest}
          className="btn btn-lg btn-primary"
          onClick={() => {
            presenter.submit();
          }}
        >
          Backtest
        </button>
      </div>
    </>
  );
}
export default observer(PageBacktest);
