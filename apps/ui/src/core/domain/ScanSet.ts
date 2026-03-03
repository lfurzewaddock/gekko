import type { UTCDate } from '@date-fns/utc';

interface ScanSetRange {
  from: UTCDate;
  to: UTCDate;
}

export interface ScanSet {
  exchange: string;
  currency: string;
  asset: string;
  range: ScanSetRange;
}

export interface ScanSets {
  exchange: string;
  currency: string;
  asset: string;
  ranges: ScanSetRange[];
}
