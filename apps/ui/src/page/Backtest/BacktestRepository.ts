import { makeObservable, observable } from 'mobx';
import { UTCDate } from '@date-fns/utc';
import { fromUnixTime } from 'date-fns';

import type { ContainerDefinition } from '#ioc';
import type { DataSet } from '#core/domain/DataSet';

interface DtoDataSet {
  exchange: string;
  currency: string;
  asset: string;
  ranges: {
    from: number;
    to: number;
  }[];
}

interface ApiDtoScansets {
  datasets: DtoDataSet[];
  errors: Pick<DtoDataSet, 'exchange' | 'currency' | 'asset'>[];
}

export class BacktestRepository {
  httpGateway;

  scansets: DataSet[] | null = null;

  constructor(opts: ContainerDefinition) {
    this.httpGateway = opts.HttpGateway;
    makeObservable(this, { scansets: observable });
    this.reset();
  }

  reset = () => {
    this.scansets = [];
  };

  // TODO - handle errors
  load = async () => {
    const scansetsDto = await this.httpGateway.post<
      Record<never, never>,
      ApiDtoScansets
    >('/scansets', {});
    this.scansets = scansetsDto.datasets.map((scansetDto) => ({
      exchange: scansetDto.exchange,
      currency: scansetDto.currency,
      asset: scansetDto.asset,
      ranges: scansetDto.ranges.map((range) => ({
        from: new UTCDate(fromUnixTime(range.from)),
        to: new UTCDate(fromUnixTime(range.to)),
      })),
    }));
  };
}
