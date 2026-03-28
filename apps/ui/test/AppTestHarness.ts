import { asClass, type AwilixContainer } from 'awilix';
import { jest } from '@jest/globals';

import { BaseIOC } from '#ioc-base';
import { FakeRouterGateway } from './routing/FakeRouterGateway';
import { FakeHttpConfig } from './core/FakeHttpConfig';
import { FakeHttpGateway } from './core/FakeHttpGateway';

import type { ContainerDefinition } from '#ioc';

export class AppTestHarness {
  container!: AwilixContainer<ContainerDefinition>;
  appPresenter!: ContainerDefinition['AppPresenter'];
  httpGateway!: ContainerDefinition['HttpGateway'];
  router!: ContainerDefinition['Router'];
  routerRepository!: ContainerDefinition['RouterRepository'];
  routerGateway!: ContainerDefinition['RouterGateway'];

  // 1. set up the app
  init() {
    this.container = new BaseIOC().buildBaseTemplate().register({
      HttpConfig: asClass(FakeHttpConfig).singleton(),
      HttpGateway: asClass(FakeHttpGateway).singleton(),
      RouterGateway: asClass(FakeRouterGateway).singleton(),
    });

    this.appPresenter = this.container.resolve('AppPresenter');
    this.router = this.container.resolve('Router');
    this.routerGateway = this.container.resolve('RouterGateway');
    this.routerRepository = this.container.resolve('RouterRepository');
    jest.spyOn(this.routerGateway, 'goToId').mockImplementation(async (routeId) => {
      this.router.updateCurrentRoute(routeId);
    });
  }

  // 2. bootstrap the app
  bootStrap(onRouteChange = () => {}) {
    this.appPresenter.load(onRouteChange);
  }

  // 3. start app
  setup = async () => {
    this.httpGateway = this.container.resolve('HttpGateway');
    // mock httpGateway method(s)
  };
}
