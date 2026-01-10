import { makeObservable, computed } from 'mobx';
import { intervalToDuration, format, formatDuration } from 'date-fns';

import type { ContainerDefinition } from '#ioc';

export type ViewModel = {
  key: string;
  exchange: string;
  currency: string;
  asset: string;
  from: string;
  to: string;
  duration: string;
}[];

export class BacktestPresenter {
  backtestRepository;

  get viewModel() {
    return (
      this.backtestRepository.scansets?.flatMap((dataset) =>
        dataset.ranges.map((range) => {
          const dateTimeFormat = 'yyyy-MM-dd kk:mm';
          return {
            key: `${dataset.exchange}|${dataset.currency}|${dataset.asset}|${range.from.toISOString()}|${range.to.toISOString()}`,
            exchange: dataset.exchange,
            currency: dataset.currency,
            asset: dataset.asset,
            from: format(range.from, dateTimeFormat),
            to: format(range.to, dateTimeFormat),
            duration: formatDuration(
              intervalToDuration({ start: range.from, end: range.to }),
              { delimiter: ', ' },
            ),
          };
        }),
      ) ?? []
    );
  }

  constructor(opts: ContainerDefinition) {
    this.backtestRepository = opts.BacktestRepository;
    makeObservable(this, {
      viewModel: computed,
    });
  }

  load = async () => {
    await this.backtestRepository.load();
  };
}
