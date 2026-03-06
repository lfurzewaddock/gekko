import type {
  HoveredTrade,
  HoverTradeMoreProps,
  ChartData,
} from '#component/chart/RoundtripLineChartComponent.tsx';

const formatTradeTooltipText = (
  trade: NonNullable<ChartData['trade']>,
): string => {
  return `${trade.action.charAt(0).toUpperCase()}${trade.action.slice(1)} @ ${trade.price}`;
};

export const resolveHoveredTrade = (
  moreProps: HoverTradeMoreProps,
  opt: {
    tradeMarkerRadius: 5;
    tradeTooltipHitPadding: 8;
  },
): HoveredTrade | undefined => {
  const datum = moreProps.currentItem;
  if (datum == null || datum.trade == null) return undefined;
  const trade = datum.trade;

  const { mouseXY, xAccessor, xScale, chartConfig } = moreProps;
  const yScale = chartConfig?.yScale;

  if (yScale == null || !Array.isArray(mouseXY) || mouseXY.length < 2)
    return undefined;

  const xValue = xAccessor(datum);
  const markerX = xScale(xValue);
  const markerY = yScale(trade.price);

  if (!Number.isFinite(markerX) || !Number.isFinite(markerY)) return undefined;

  const [mouseX, mouseY] = mouseXY;

  const hoverHitRadius = opt.tradeMarkerRadius + opt.tradeTooltipHitPadding;
  const dx = mouseX - markerX;
  const dy = mouseY - markerY;

  if (dx * dx + dy * dy > hoverHitRadius * hoverHitRadius) return undefined;

  return {
    xValue,
    price: trade.price,
    text: formatTradeTooltipText(trade),
  };
};

export const render =
  (hoveredTrade?: HoveredTrade) => (moreProps: HoverTradeMoreProps) => {
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
        {/*Background colour filter (best for dynamic text)*/}
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
