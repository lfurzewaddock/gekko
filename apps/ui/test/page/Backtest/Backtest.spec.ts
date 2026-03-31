import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UTCDate } from '@date-fns/utc';
import { fromUnixTime } from 'date-fns';

import { ok } from '#util/error';

import { AppTestHarness } from '../../AppTestHarness';
import { PostSuccessScansetsReadStub } from '../../fixtures/api/PostSuccessScansetsReadStub';

import type { ContainerDefinition } from '#ioc';
import { ApiDtoScansets } from '#page/Backtest/BacktestDto.ts';
import type { FakeHttpGateway } from '../../core/FakeHttpGateway';

let appTestHarness: AppTestHarness;
let navigationPresenter: ContainerDefinition['NavigationPresenter'];
let router: ContainerDefinition['Router'];
let routerGateway: ContainerDefinition['RouterGateway'];
let backtestPresenter: ContainerDefinition['BacktestPresenter'];
let backtestRepository: ContainerDefinition['BacktestRepository'];
let dataGateway: FakeHttpGateway;

describe('Backest', () => {
  beforeEach(async () => {
    // IOC singletons - new container means a new instance
    appTestHarness = new AppTestHarness();
    appTestHarness.init();
    appTestHarness.bootStrap(() => {});

    navigationPresenter = appTestHarness.container.resolve('NavigationPresenter');
    router = appTestHarness.container.resolve('Router');
    routerGateway = appTestHarness.container.resolve('RouterGateway');
    backtestPresenter = appTestHarness.container.resolve('BacktestPresenter');
    backtestRepository = appTestHarness.container.resolve('BacktestRepository');
    dataGateway = appTestHarness.container.resolve<FakeHttpGateway>('HttpGateway');
  });

  describe('loading', () => {
    const setupLoads = async () => {
      const scansets: ApiDtoScansets = PostSuccessScansetsReadStub();
      dataGateway.setPostResult('/scansets', ok(scansets));
      // dataGateway.setGetResult('/strategies', ok(strategies));

      await backtestRepository.load();
    };

    it('should load list of scansets from viewmodel', async () => {
      await setupLoads();

      expect(dataGateway.postCalls[0]).toMatchObject({
        path: '/scansets',
        reqDto: {},
      });
      expect(dataGateway.postCalls.length).toBe(1);
      expect(backtestPresenter.viewModel.scansets[0]).toMatchObject({
        key: `binance|USDT|BTC|2025-09-15T17:04:00.000Z|2026-03-17T23:22:00.000Z`,
        exchange: 'binance',
        currency: 'USDT',
        asset: 'BTC',
        from: new UTCDate(fromUnixTime(1757955840)),
        to: new UTCDate(fromUnixTime(1773789720)),
        fromLabel: '2025-09-15 17:04',
        toLabel: '2026-03-17 23:22',
        duration: '6 months, 2 days, 6 hours, 18 minutes',
      });
      // spot checks (one pair, two date ranges (1st))
      expect(backtestPresenter.viewModel.scansets[1]).toMatchObject({
        key: `kraken|GBP|ETH|2025-09-15T13:27:00.000Z|2025-12-01T12:27:00.000Z`,
        exchange: 'kraken',
        currency: 'GBP',
        asset: 'ETH',
        from: new UTCDate(fromUnixTime(1757942820)),
        to: new UTCDate(fromUnixTime(1764592020)),
        fromLabel: '2025-09-15 13:27',
        toLabel: '2025-12-01 12:27',
        duration: '2 months, 15 days, 23 hours',
      });
      // spot checks (one pair, two date ranges (2nd))
      expect(backtestPresenter.viewModel.scansets[2]).toMatchObject({
        key: `kraken|GBP|ETH|2025-12-18T15:27:00.000Z|2026-01-15T03:27:00.000Z`,
        exchange: 'kraken',
        currency: 'GBP',
        asset: 'ETH',
        from: new UTCDate(fromUnixTime(1766071620)),
        to: new UTCDate(fromUnixTime(1768447620)),
        fromLabel: '2025-12-18 15:27',
        toLabel: '2026-01-15 03:27',
        duration: '27 days, 12 hours',
      });
      expect(backtestPresenter.viewModel.scansets.length).toBe(4);
    });

    it('should disable backtest button', () => {
      expect(backtestPresenter.viewModel.isEnableBtnBackest).toBe(false);
    });
  });
});
