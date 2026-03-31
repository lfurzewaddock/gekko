import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import {
  Brush,
  CircleMarker,
  Chart,
  ChartCanvas,
  GenericChartComponent,
  ScatterSeries,
  XAxis,
  YAxis,
  discontinuousTimeScaleProviderBuilder,
  LineSeries,
  type LineSeriesProps,
} from '@lfurzewaddock/react-financial-charts';
import { UTCDate } from '@date-fns/utc';

import StaticAutoSizer from '../layout/StaticAutoSizerComponent';
import * as ChartTradeTooltipComponent from '#component/chart/ChartTradeTooltipComponent.tsx';

import type { TradeAction } from '#core/domain/Backtest';

export interface ChartData {
  date: UTCDate;
  open: number;
  trade: { date: UTCDate; price: number; action: TradeAction } | null;
}
export interface HoveredTrade {
  readonly xValue: number | Date;
  readonly price: number;
  readonly text: string;
}

export interface HoverTradeMoreProps extends FocusChartInteractionMoreProps {
  readonly currentItem?: ChartData;
  readonly mouseXY?: [number, number];
  readonly xAccessor: (datum: ChartData) => XValue;
  readonly chartConfig?: {
    yScale?: (value: number) => number;
  };
}

type XValue = number | Date;

type XScaleWithDomain = ((value: XValue) => number) & {
  domain: () => [XValue, XValue];
};

interface FocusChartInteractionMoreProps {
  readonly xScale: XScaleWithDomain;
}

interface FocusContextState {
  readonly focusExtents?: [XValue, XValue];
  readonly hoveredTrade?: HoveredTrade;
}

interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface FocusCtxProps {
  readonly ctxLineStrokeStyle?: string;
  readonly ctxBrushStrokeStyle?: string;
  readonly ctxBrushFillStyle?: string;
  readonly ctxBrushMinSelectionSize?: number;
  readonly ctxXAxisShowGridLines?: boolean;
}
interface ChartProps<T extends ChartData> extends FocusCtxProps, Partial<LineSeriesProps> {
  readonly data: T[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
  readonly tickFormat?: (idx: number) => string;
  readonly margin?: ChartMargin;
  readonly tradeMarkerFill?: (action?: 'buy' | 'sell') => string | undefined;
  readonly formatTradeTooltipTxt: (trade: NonNullable<ChartData['trade']>) => string;
  readonly isDisplayTradeTooltip?: boolean;
  readonly focusChartXAxisHasGridLines?: boolean;
}

const focusMarginDefault = {
  left: 100,
  right: 40,
  top: 0,
  bottom: 24,
};

const ctxMarginDefault = {
  left: 100,
  right: 40,
  top: 0,
  bottom: 24,
};

const ctxCanvasHeight = 140;
const tradeMarkerRadius = 5;
const tradeTooltipHitPadding = 8;

const yAccessor = (datum: ChartData) => {
  return datum.open;
};

const tradeYAccessor = (datum: ChartData) => {
  return datum.trade?.price;
};

const toComparableValue = (value: XValue) => {
  return value instanceof Date ? value.valueOf() : value;
};

function RoundtripLineChart<T extends ChartData>(props: ChartProps<T>) {
  const [focusExtents, setFocusExtents] = useState<FocusContextState['focusExtents']>(undefined);
  const [hoveredTrade, setHoveredTrade] = useState<FocusContextState['hoveredTrade']>(undefined);

  const xScaleProvider = useMemo(
    () => discontinuousTimeScaleProviderBuilder().inputDateAccessor((datum: T) => datum.date),
    [],
  );

  const clearHoveredTrade = useCallback(() => {
    setHoveredTrade((currentHoveredTrade) => {
      return currentHoveredTrade == null ? currentHoveredTrade : undefined;
    });
  }, []);

  const updateFocusExtents = useCallback((left: XValue, right: XValue) => {
    const leftValue = toComparableValue(left);
    const rightValue = toComparableValue(right);

    const nextExtents: [XValue, XValue] = leftValue <= rightValue ? [left, right] : [right, left];

    setFocusExtents((currentExtents) => {
      if (currentExtents !== undefined) {
        const [currentStart, currentEnd] = currentExtents;
        const currentStartValue = toComparableValue(currentStart);
        const currentEndValue = toComparableValue(currentEnd);
        const nextStartValue = toComparableValue(nextExtents[0]);
        const nextEndValue = toComparableValue(nextExtents[1]);

        if (currentStartValue === nextStartValue && currentEndValue === nextEndValue)
          return currentExtents;
      }

      return nextExtents;
    });
  }, []);

  const handleBrush = useCallback(
    ({ start, end }: { start: { xValue: XValue }; end: { xValue: XValue } }) => {
      clearHoveredTrade();
      updateFocusExtents(start.xValue, end.xValue);
    },
    [clearHoveredTrade, updateFocusExtents],
  );

  const handleFocusChartInteraction = useCallback(
    (_: unknown, moreProps: FocusChartInteractionMoreProps) => {
      const [start, end] = moreProps.xScale.domain();

      clearHoveredTrade();
      updateFocusExtents(start, end);
    },
    [clearHoveredTrade, updateFocusExtents],
  );

  const handleHoverTradeTooltip = useCallback((_: MouseEvent, moreProps: HoverTradeMoreProps) => {
    const nextHoveredTrade = ChartTradeTooltipComponent.resolveHoveredTrade(
      moreProps,
      { tradeMarkerRadius, tradeTooltipHitPadding },
      formatTradeTooltipTxt,
    );

    if (!isDisplayTradeTooltip) return;
    setHoveredTrade((currentHoveredTrade) => {
      if (
        currentHoveredTrade?.price === nextHoveredTrade?.price &&
        currentHoveredTrade?.text === nextHoveredTrade?.text &&
        toComparableValue(currentHoveredTrade?.xValue ?? 0) ===
          toComparableValue(nextHoveredTrade?.xValue ?? 0)
      )
        return currentHoveredTrade;

      return nextHoveredTrade;
    });
  }, []);

  const renderHoveredTradeTooltip = ChartTradeTooltipComponent.render(hoveredTrade);

  const {
    data: initialData,
    height,
    ratio,
    width,
    margin,
    tickFormat,
    tradeMarkerFill,
    formatTradeTooltipTxt,
    isDisplayTradeTooltip = true,
    ctxBrushStrokeStyle = '#2563eb',
    ctxLineStrokeStyle = '#2563eb',
    ctxBrushFillStyle = 'rgba(37, 99, 235, 0.18)',
    ctxBrushMinSelectionSize = 5,
    ctxXAxisShowGridLines = true,
    focusChartXAxisHasGridLines = true,
    ...rest
  } = props;

  const tradeMarkerProps = useMemo(
    () => ({
      r: tradeMarkerRadius,
      fillStyle: tradeMarkerFill ? (datum: T) => tradeMarkerFill(datum.trade?.action) : undefined,
      strokeStyle: '#ffffff',
      strokeWidth: 1,
    }),
    [],
  );

  const focusMargin = margin
    ? {
        ...focusMarginDefault,
        ...margin,
      }
    : focusMarginDefault;

  const ctxMargin = margin
    ? {
        ...ctxMarginDefault,
        left: margin.left ?? ctxMarginDefault.left,
        right: margin.right ?? ctxMarginDefault.right,
      }
    : ctxMarginDefault;

  const focusCanvasHeight = height - ctxCanvasHeight - 12;
  if (focusCanvasHeight <= 0) return null;

  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData);
  if (data.length === 0) return null;

  const ctxExtents: [XValue, XValue] = [xAccessor(data[0]), xAccessor(data[data.length - 1])];
  const currentFocusExtents = focusExtents ?? ctxExtents;

  const brushInteractiveState = {
    start: {
      item: undefined,
      xValue: currentFocusExtents[0],
    },
    end: {
      item: undefined,
      xValue: currentFocusExtents[1],
    },
  };

  return (
    <div style={{ height, width }}>
      <ChartCanvas
        height={focusCanvasHeight}
        ratio={ratio}
        width={width}
        margin={focusMargin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName="FocusChartData"
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={currentFocusExtents}
      >
        <Chart id={1} yExtents={yAccessor}>
          <XAxis tickFormat={tickFormat} showGridLines={focusChartXAxisHasGridLines} />
          <YAxis axisAt="left" orient="left" />
          <LineSeries yAccessor={yAccessor} {...rest} />
          <ScatterSeries
            yAccessor={tradeYAccessor}
            marker={CircleMarker}
            markerProps={tradeMarkerProps}
          />
          <GenericChartComponent
            drawOn={['pan', 'zoom', 'mousemove']}
            onPan={clearHoveredTrade}
            onPanEnd={handleFocusChartInteraction}
            onZoom={handleFocusChartInteraction}
            onMouseMove={handleHoverTradeTooltip}
            svgDraw={renderHoveredTradeTooltip}
          />
        </Chart>
      </ChartCanvas>

      <ChartCanvas
        height={ctxCanvasHeight}
        ratio={ratio}
        width={width}
        margin={ctxMargin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName="ContextChartData"
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={ctxExtents}
        disablePan
        disableZoom
        useCrossHairStyleCursor={false}
      >
        <Chart id={2} yExtents={yAccessor}>
          <XAxis ticks={6} showGridLines={ctxXAxisShowGridLines} />
          <YAxis ticks={3} showTicks={false} showDomain={false} showTickLabel={false} />
          <LineSeries yAccessor={yAccessor} strokeStyle={ctxLineStrokeStyle} />
          <Brush
            enabled
            type="1D"
            onBrushChange={handleBrush}
            interactiveState={brushInteractiveState}
            minimumSelectionSize={ctxBrushMinSelectionSize}
            strokeStyle={ctxBrushStrokeStyle}
            fillStyle={ctxBrushFillStyle}
          />
        </Chart>
      </ChartCanvas>
    </div>
  );
}

interface RoundtripLineChartComponentProps<T extends ChartData> extends Omit<
  ChartProps<T>,
  'height' | 'width' | 'ratio'
> {
  readonly ratio?: number;
}

const getDeviceRatio = () => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

export function RoundtripLineChartComponent<T extends ChartData>({
  ratio = getDeviceRatio(),
  ...rest
}: RoundtripLineChartComponentProps<T>) {
  return (
    <StaticAutoSizer classes="min-h-150">
      {({ width, height }) => {
        const chartProps: ChartProps<T> = {
          ...rest,
          height,
          width,
          ratio,
        };
        return <RoundtripLineChart {...chartProps} />;
      }}
    </StaticAutoSizer>
  );
}
