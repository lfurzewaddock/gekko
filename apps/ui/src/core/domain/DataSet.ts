import type { UTCDate } from '@date-fns/utc';

export interface DataSet {
  exchange: string;
  currency: string;
  asset: string;
  ranges: {
    from: UTCDate;
    to: UTCDate;
  }[];
}
