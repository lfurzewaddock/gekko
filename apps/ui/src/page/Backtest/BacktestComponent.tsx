import { observer } from 'mobx-react';
import { useDependency } from '#core/hooks/use-dependency';
import container from '#ioc';
import ScansetTableComponent from './ScansetTableComponent';

import type { ContainerDefinition } from '#ioc';
import BacktestFormComponent from '#page/Backtest/BacktestFormComponent/BacktestFormComponent';
import BacktestChartComponent from '#page/Backtest/BacktestChartComponent/BacktestChartComponent';

function PageBacktest() {
  const presenter =
    useDependency<ContainerDefinition['BacktestPresenter']>(
      'BacktestPresenter',
    );

  return (
    <>
      <h1 className="text-5xl/20">Backtest</h1>
      <ScansetTableComponent presenter={presenter}>
        {presenter.viewModel.scansets}
      </ScansetTableComponent>
      <BacktestFormComponent />
      <BacktestChartComponent />
      <div>
        <h2>IoC Container Registration(s)</h2>
        <pre>{JSON.stringify(container.registrations, null, 2)}</pre>
      </div>
      <div className="fab">
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
