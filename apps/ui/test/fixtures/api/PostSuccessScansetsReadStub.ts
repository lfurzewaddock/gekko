export function PostSuccessScansetsReadStub() {
  return {
    datasets: [
      {
        exchange: 'binance',
        currency: 'USDT',
        asset: 'BTC',
        ranges: [
          {
            from: 1757955840,
            to: 1773789720,
          },
        ],
      },
      {
        exchange: 'kraken',
        currency: 'GBP',
        asset: 'ETH',
        ranges: [
          {
            to: 1764592020,
            from: 1757942820,
          },
          {
            to: 1768447620,
            from: 1766071620,
          },
        ],
      },
      {
        exchange: 'kraken',
        currency: 'USD',
        asset: 'LTC',
        ranges: [
          {
            from: 1750204800,
            to: 1773680520,
          },
        ],
      },
    ],
    errors: [],
  };
}
