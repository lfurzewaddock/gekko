import React from 'react';
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
  withDeviceRatio,
  withSize,
  type LineSeriesProps,
} from '@lfurzewaddock/react-financial-charts';
import { UTCDate } from '@date-fns/utc';

export interface ChartData {
  date: UTCDate;
  open: number;
  trade: { date: UTCDate; price: number; action: 'buy' | 'sell' } | null;
}

export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface FocusContextState {
  readonly focusExtents?: [number | Date, number | Date];
  readonly hoveredTrade?: {
    readonly xValue: number | Date;
    readonly price: number;
    readonly text: string;
  };
}

interface FocusCtxProps {
  readonly ctxLineStrokeStyle?: string;
  readonly ctxBrushStrokeStyle?: string;
  readonly ctxBrushFillStyle?: string;
  readonly ctxBrushMinSelectionSize?: number;
  readonly ctxXAxisShowGridLines?: boolean;
}

interface ChartProps<T extends ChartData>
  extends FocusCtxProps, Partial<LineSeriesProps> {
  readonly data: T[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
  readonly tickFormat?: (idx: number) => string;
  readonly margin?: ChartMargin;
}

class BasicLineSeries<T extends ChartData> extends React.Component<
  ChartProps<T>,
  FocusContextState
> {
  // private margin: Required<ChartMargin> = {
  //   left: 100,
  //   right: 40,
  //   top: 0,
  //   bottom: 24,
  // };
  private readonly focusMargin = { left: 100, right: 40, top: 0, bottom: 24 };
  private readonly contextMargin = { left: 100, right: 40, top: 0, bottom: 24 };
  private readonly contextCanvasHeight = 140;
  private readonly xScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: T) => d.date);

  // private yExtents = [0, 0];

  public constructor(props: ChartProps<T>) {
    super(props);

    this.state = {
      focusExtents: undefined,
      hoveredTrade: undefined,
    };
  }

  public render() {
    const {
      data: initialData,
      height,
      ratio,
      width,
      margin,
      tickFormat,
      ctxBrushStrokeStyle = '#2563eb',
      ctxLineStrokeStyle = '#2563eb',
      ctxBrushFillStyle = 'rgba(37, 99, 235, 0.18)',
      ctxBrushMinSelectionSize = 5,
      ctxXAxisShowGridLines = true,
      ...rest
    } = this.props;

    // if (margin)
    //   this.margin = {
    //     ...this.margin,
    //     ...margin,
    //   };

    // const { data, xScale, xAccessor, displayXAccessor } =
    //   this.xScaleProvider(initialData);
    // if (data.length === 0) return;

    // const max = xAccessor(data[data.length - 1]);
    // const min = xAccessor(data[0]);
    // const xExtents = [min, max];

    // this.yExtents = initialData.reduce(
    //   ([prevMin, prevMax], { open }) => [
    //     Math.min(prevMin, open),
    //     Math.max(prevMax, open),
    //   ],
    //   [Infinity, -Infinity],
    // );

    const { contextCanvasHeight, contextMargin, focusMargin, xScaleProvider } =
      this;

    const resolvedFocusMargin = margin
      ? {
          ...focusMargin,
          ...margin,
        }
      : focusMargin;

    const resolvedContextMargin = margin
      ? {
          ...contextMargin,
          left: margin.left ?? contextMargin.left,
          right: margin.right ?? contextMargin.right,
        }
      : contextMargin;

    const focusCanvasHeight = height - contextCanvasHeight - 12;
    if (focusCanvasHeight <= 0) return;

    const { data, xScale, xAccessor, displayXAccessor } =
      xScaleProvider(initialData);
    if (data.length === 0) return;

    const contextExtents: [number | Date, number | Date] = [
      xAccessor(data[0]),
      xAccessor(data[data.length - 1]),
    ];

    const defaultFocusExtents: [number | Date, number | Date] = contextExtents;

    const focusExtents = this.state.focusExtents ?? defaultFocusExtents;

    const brushInteractiveState = {
      start: {
        item: undefined,
        xValue: focusExtents[0],
      },
      end: {
        item: undefined,
        xValue: focusExtents[1],
      },
    };

    return (
      <div style={{ height, width }}>
        <ChartCanvas
          height={focusCanvasHeight}
          ratio={ratio}
          width={width}
          margin={resolvedFocusMargin}
          data={data}
          displayXAccessor={displayXAccessor}
          seriesName="Data"
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={focusExtents}
        >
          <Chart id={1} yExtents={this.yAccessor}>
            <XAxis tickFormat={tickFormat} />
            <YAxis axisAt="left" orient="left" />
            <LineSeries yAccessor={this.yAccessor} {...rest} />
            <ScatterSeries
              yAccessor={this.tradeYAccessor}
              marker={CircleMarker}
              markerProps={this.tradeMarkerProps}
            />
            <GenericChartComponent
              drawOn={['pan', 'zoom', 'mousemove']}
              onPan={this.clearHoveredTrade}
              onPanEnd={this.handleFocusChartInteraction}
              onZoom={this.handleFocusChartInteraction}
              onMouseMove={this.handleHoverTradeTooltip}
              svgDraw={this.renderHoveredTradeTooltip}
            />
          </Chart>
        </ChartCanvas>

        <ChartCanvas
          height={contextCanvasHeight}
          ratio={ratio}
          width={width}
          margin={resolvedContextMargin}
          // height={100}
          // ratio={1}
          // width={500}
          // margin={{ left: 30, right: 20, top: 20, bottom: 20 }}
          data={data}
          displayXAccessor={displayXAccessor}
          seriesName="ContextData"
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={contextExtents}
          disablePan
          disableZoom
          useCrossHairStyleCursor={false}
        >
          <Chart id={2} yExtents={this.yAccessor}>
            <XAxis ticks={6} showGridLines={ctxXAxisShowGridLines} />
            <YAxis
              ticks={3}
              showTicks={false}
              showDomain={false}
              showTickLabel={false}
            />
            <LineSeries
              yAccessor={this.yAccessor}
              strokeStyle={ctxLineStrokeStyle}
            />
            <Brush
              enabled
              type="1D"
              onBrushChange={this.handleBrush}
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

  private readonly yAccessor = (data: T) => {
    return data.open;
  };

  private readonly tradeYAccessor = (data: T) => {
    return data.trade?.price;
  };

  private readonly tradeMarkerRadius = 5;
  private readonly tradeTooltipHitPadding = 8;

  private readonly tradeMarkerProps = {
    r: this.tradeMarkerRadius,
    fillStyle: (datum: T) => {
      if (datum.trade?.action === 'buy') return '#16a34a';
      if (datum.trade?.action === 'sell') return '#dc2626';
      return 'none';
    },
    strokeStyle: '#ffffff',
    strokeWidth: 1,
  };

  private readonly handleBrush = ({
    start,
    end,
  }: {
    start: { xValue: number | Date };
    end: { xValue: number | Date };
  }) => {
    this.clearHoveredTrade();
    this.updateFocusExtents(start.xValue, end.xValue);
  };

  private readonly handleFocusChartInteraction = (_: any, moreProps: any) => {
    const [start, end] = moreProps.xScale.domain() as [
      number | Date,
      number | Date,
    ];

    this.clearHoveredTrade();
    this.updateFocusExtents(start, end);
  };

  private readonly handleHoverTradeTooltip = (_: any, moreProps: any) => {
    const hoveredTrade = this.resolveHoveredTrade(moreProps);

    const currentHoveredTrade = this.state.hoveredTrade;

    if (
      currentHoveredTrade?.price === hoveredTrade?.price &&
      currentHoveredTrade?.text === hoveredTrade?.text &&
      this.toComparableValue(currentHoveredTrade?.xValue ?? 0) ===
        this.toComparableValue(hoveredTrade?.xValue ?? 0)
    )
      return;

    this.setState({
      hoveredTrade,
    });
  };

  private readonly resolveHoveredTrade = (moreProps: any) => {
    const datum = moreProps.currentItem as T | undefined;
    const trade = datum?.trade;
    if (trade == null) return undefined;

    const { mouseXY, xAccessor, xScale, chartConfig } = moreProps;
    const yScale = chartConfig?.yScale as
      | ((value: number) => number)
      | undefined;

    if (yScale == null || !Array.isArray(mouseXY) || mouseXY.length < 2)
      return undefined;

    const xValue = xAccessor(datum) as number | Date;
    const markerX = xScale(xValue);
    const markerY = yScale(trade.price);

    if (!Number.isFinite(markerX) || !Number.isFinite(markerY))
      return undefined;

    const [mouseX, mouseY] = mouseXY as [number, number];

    const hoverHitRadius = this.tradeMarkerRadius + this.tradeTooltipHitPadding;
    const dx = mouseX - markerX;
    const dy = mouseY - markerY;

    if (dx * dx + dy * dy > hoverHitRadius * hoverHitRadius) return undefined;

    return {
      xValue,
      price: trade.price,
      text: this.formatTradeTooltipText(trade),
    };
  };

  private readonly formatTradeTooltipText = (
    trade: NonNullable<T['trade']>,
  ): string => {
    return `${trade.action.charAt(0).toUpperCase()}${trade.action.slice(1)} @ ${trade.price}`;
  };

  private readonly renderHoveredTradeTooltip = (moreProps: any) => {
    const hoveredTrade = this.state.hoveredTrade;
    if (hoveredTrade == null) return null;

    const { xScale, chartConfig } = moreProps;
    const yScale = chartConfig?.yScale as
      | ((value: number) => number)
      | undefined;

    if (yScale == null) return null;

    const markerX = xScale(hoveredTrade.xValue);
    const markerY = yScale(hoveredTrade.price);

    if (!Number.isFinite(markerX) || !Number.isFinite(markerY)) return null;

    return (
      <g pointerEvents="none" className="react-financial-charts-trade-tooltip">
        {/*Background colour filter (Best for Dynamic Text)*/}
        <defs>
          <filter x="0" y="0" width="1" height="1" id="solid-txt-bg">
            <feFlood floodColor="black" result="bg" />
            <feMerge>
              <feMergeNode in="bg" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x={markerX + 8}
          y={markerY - 10}
          fill="#ffffff"
          stroke="rgba(15, 23, 42, 0.85)"
          strokeWidth={4}
          paintOrder="stroke"
          fontSize={11}
          fontFamily="-apple-system, system-ui, Roboto, 'Helvetica Neue', Ubuntu, sans-serif"
          filter="url(#solid-txt-bg)"
        >
          {hoveredTrade.text}
        </text>
      </g>
    );
  };

  private readonly clearHoveredTrade = () => {
    if (this.state.hoveredTrade == null) return;

    this.setState({
      hoveredTrade: undefined,
    });
  };

  private readonly updateFocusExtents = (
    left: number | Date,
    right: number | Date,
  ) => {
    const leftValue = this.toComparableValue(left);
    const rightValue = this.toComparableValue(right);

    const nextExtents: [number | Date, number | Date] =
      leftValue <= rightValue ? [left, right] : [right, left];

    const currentExtents = this.state.focusExtents;
    if (currentExtents !== undefined) {
      const [currentStart, currentEnd] = currentExtents;
      const currentStartValue = this.toComparableValue(currentStart);
      const currentEndValue = this.toComparableValue(currentEnd);
      const nextStartValue = this.toComparableValue(nextExtents[0]);
      const nextEndValue = this.toComparableValue(nextExtents[1]);

      if (
        currentStartValue === nextStartValue &&
        currentEndValue === nextEndValue
      )
        return;
    }

    this.setState({
      focusExtents: nextExtents,
    });
  };

  private readonly toComparableValue = (value: number | Date) => {
    return value instanceof Date ? value.valueOf() : value;
  };
}

export const Daily = withSize({
  style: { minHeight: 600 },
})(withDeviceRatio()(BasicLineSeries));
