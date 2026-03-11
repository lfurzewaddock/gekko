import { observer } from 'mobx-react';

import { useDependency } from '#core/hooks/use-dependency';

import { RoundtripLineChartComponent } from '#component/chart/RoundtripLineChartComponent.tsx';

import type { ContainerDefinition } from '#ioc';

function BacktestFormComponent() {
  const presenter = useDependency<
    ContainerDefinition['BacktestChartPresenter']
  >('BacktestChartPresenter');

  return (
    <div
      className="relative w-screen ml-[50%] -translate-x-1/2"
      style={{
        width: 'calc(100vw - 15px)',
      }}
    >
      <div className="absolute bg-gray-400 opacity-10 cursor-zoom-in top-0 bottom-0 left-0 right-0"></div>
      <RoundtripLineChartComponent
        data={presenter.viewModel.chartData}
        tickFormat={presenter.tickFormat}
        tradeMarkerFill={presenter.tradeMarkerFill}
        formatTradeTooltipTxt={presenter.formatTradeTooltipTxt}
        isDisplayTradeTooltip={presenter.cfg.isDisplayTradeTooltip}
        margin={presenter.cfg.focusChartMargin}
        ctxBrushStrokeStyle={presenter.cfg.ctxBrushStrokeStyle}
        ctxLineStrokeStyle={presenter.cfg.ctxLineStrokeStyle}
        ctxBrushFillStyle={presenter.cfg.ctxBrushFillStyle}
        ctxBrushMinSelectionSize={presenter.cfg.ctxBrushMinSelectionSize}
        ctxXAxisShowGridLines={presenter.cfg.ctxXAxisHasGridLines}
        focusChartXAxisHasGridLines={presenter.cfg.focusChartXAxisHasGridLines}
      />
    </div>
  );
}

export default observer(BacktestFormComponent);
