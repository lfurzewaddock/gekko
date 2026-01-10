import { observer } from 'mobx-react';

import { useDependency } from '#core/hooks/use-dependency';
import container from '#ioc';
import ScansetTableComponent from './ScansetTableComponent';
import type { ContainerDefinition } from '#ioc';

function PageBacktest() {
  const presenter =
    useDependency<ContainerDefinition['BacktestPresenter']>(
      'BacktestPresenter',
    );

  return (
    <>
      <h1 className="text-5xl/20">Backtest</h1>
      <ScansetTableComponent>{presenter.viewModel}</ScansetTableComponent>
      <div>
        <h2>IoC Container Registration(s)</h2>
        <pre>{JSON.stringify(container.registrations, null, 2)}</pre>
      </div>
    </>
  );
}
export default observer(PageBacktest);
