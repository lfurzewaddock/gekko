import React from 'react';
import {
  Annotate,
  Brush,
  Chart,
  ChartCanvas,
  GenericChartComponent,
  MarkerAnnotation,
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
}

interface FocusCtxProps {
  readonly ctxLineStrokeStyle: string;
  readonly ctxBrushStrokeStyle: string;
  readonly ctxBrushFillStyle: string;
  readonly ctxBrushMinSelectionSize: number;
  readonly ctxXAxisShowGridLines: boolean;
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
    };
  }

  public render() {
    const {
      data: initialData,
      defined,
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
          margin={focusMargin}
          data={data}
          displayXAccessor={displayXAccessor}
          seriesName="Data"
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={focusExtents}
        >
          <Chart id={1} yExtents={this.focusYExtents}>
            <XAxis tickFormat={tickFormat} />
            <YAxis axisAt="left" orient="left" />
            <LineSeries yAccessor={this.yAccessor} {...rest} />
            <Annotate
              with={MarkerAnnotation}
              usingProps={{
                markerShape: 'circle',
                markerSize: 4, // radius
                fillStyle: (datum: T) => {
                  const { trade } = datum;
                  if (trade == null) return;
                  if (trade.action === 'buy') return 'green';
                  if (trade.action === 'sell') return 'red';
                }, // fill color
                tooltip: (datum: T) => {
                  const { trade } = datum;
                  if (trade == null) return;
                  return `${trade.action.charAt(0).toUpperCase()}${trade.action.slice(1)} @ ${trade.price}`;
                },
                strokeStyle: '#ffffff', // stroke color
                strokeWidth: 1,
                y: ({
                  yScale,
                  datum,
                }: {
                  yScale: (n: number) => number;
                  datum: T;
                }): number | undefined => {
                  if (datum.trade) return yScale(datum.trade.price);
                },
              }}
              when={this.when}
            />
            <GenericChartComponent
              drawOn={['pan', 'zoom']}
              onPan={this.handleFocusChartInteraction}
              onPanEnd={this.handleFocusChartInteraction}
              onZoom={this.handleFocusChartInteraction}
            />
          </Chart>
        </ChartCanvas>

        <ChartCanvas
          height={contextCanvasHeight}
          ratio={ratio}
          width={width}
          margin={contextMargin}
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
          <Chart id={2} yExtents={this.contextYExtents}>
            <XAxis ticks={6} showGridLines={ctxXAxisShowGridLines} />
            <YAxis
              ticks={3}
              showTicks={false}
              showDomain={false}
              showTickLabel={false}
            />
            <LineSeries
              yAccessor={this.contextYExtents}
              strokeStyle={ctxLineStrokeStyle}
            />
            <Brush
              enabled
              type="1D"
              onBrush={this.handleBrush}
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

  private readonly when = (data: T) => {
    return data.trade != null;
  };

  private readonly handleBrush = ({
    start,
    end,
  }: {
    start: { xValue: number | Date };
    end: { xValue: number | Date };
  }) => {
    this.updateFocusExtents(start.xValue, end.xValue);
  };

  private readonly handleFocusChartInteraction = (_: any, moreProps: any) => {
    const [start, end] = moreProps.xScale.domain() as [
      number | Date,
      number | Date,
    ];

    this.updateFocusExtents(start, end);
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

  private readonly focusYExtents = (d: T) => {
    return [d.open, d.open];
  };

  private readonly contextYExtents = (d: T) => {
    return d.open;
  };
}

export const Daily = withSize({
  style: { minHeight: 600 },
})(withDeviceRatio()(BasicLineSeries));
