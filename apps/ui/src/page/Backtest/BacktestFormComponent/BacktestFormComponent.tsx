import { observer } from 'mobx-react';

import { useDependency } from '#core/hooks/use-dependency';
import SplitScreenComponent from '#component/layout/SplitScreenComponent.tsx';

import type { ContainerDefinition } from '#ioc';

function BacktestFormComponent() {
  const presenter = useDependency<ContainerDefinition['BacktestFormPresenter']>(
    'BacktestFormPresenter',
  );

  return (
    <form>
      <SplitScreenComponent>
        <div>
          <h1>Strategy</h1>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Strategy</legend>
            <select
              className="select"
              name="strategy"
              value={presenter.viewModel.strategySelected}
              onChange={(evt) => {
                presenter.handleStrategySelectChange(evt.target.value);
              }}
            >
              {presenter.viewModel.strategyNames?.map((strat) => {
                return <option key={strat}>{strat}</option>;
              })}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Candle Size</legend>
            <SplitScreenComponent>
              <div>
                <input
                  type="number"
                  className="input"
                  name="candle-size"
                  min={1}
                  placeholder="candle size"
                  value={presenter.viewModel.candleSize}
                  onChange={(evt) => {
                    presenter.handleCandleSizeChange(evt.target.value);
                  }}
                />
              </div>
              <div>
                <select
                  className="select"
                  name="candle-size-unit"
                  value={presenter.viewModel.candleSizeUnitSelected}
                  onChange={(evt) => {
                    presenter.handleCandleSizeUnitChange(evt.target.value);
                  }}
                >
                  {presenter.viewModel.candleSizeUnits?.map((unit) => {
                    return <option key={unit}>{unit}</option>;
                  })}
                </select>
              </div>
            </SplitScreenComponent>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {presenter.viewModel.historySizeLegend}
            </legend>
            <input
              type="number"
              className="input"
              name="history-size"
              min={1}
              placeholder="history size"
              value={presenter.viewModel.historySize}
              onChange={(evt) => {
                presenter.handleHistorySizeChange(evt.target.value);
              }}
            />
            <p className="label">{presenter.viewModel.historySizeLabel}</p>
          </fieldset>
        </div>
        <div>
          <h1>Parameters</h1>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {presenter.viewModel.parametersLegend}
            </legend>
            <textarea
              className="textarea field-sizing-content resize-y min-h-36 max-h-48"
              name="parameters"
              placeholder="strategy parameters"
              value={presenter.viewModel.strategySelectedParams}
            />
          </fieldset>
        </div>
      </SplitScreenComponent>
      <button className="btn">Submit</button>
    </form>
  );
}

export default observer(BacktestFormComponent);
