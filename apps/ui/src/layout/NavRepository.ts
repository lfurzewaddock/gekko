import { makeObservable, computed } from 'mobx';

import type { ContainerDefinition } from '#ioc';

import type { RouteIdents } from '#routing/RouterRepository';

export type NavNode = {
  id: RouteIdents;
  type: 'root' | 'sub' | 'external';
  text: string;
};

export class NavigationRepository {
  router;

  get currentNode() {
    var self = this;
    return this.getPrimaryNavNodes().filter(function (node) {
      return node.id === self.router.currentRoute.routeId;
    })[0];
  }

  constructor(opts: ContainerDefinition) {
    this.router = opts.Router;
    makeObservable(this, {
      currentNode: computed,
    });
  }

  getPrimaryNavNodes() {
    const primaryNavNodes: NavNode[] = [
      {
        id: 'homeLink',
        type: 'root',
        text: 'Home',
      },
      {
        id: 'liveGekkosLink',
        type: 'root',
        text: 'Live Gekkos',
      },
      {
        id: 'backtestLink',
        type: 'root',
        text: 'Backtest',
      },
      {
        id: 'localDataLink',
        type: 'root',
        text: 'Local Data',
      },
      {
        id: 'configLink',
        type: 'root',
        text: 'Config',
      },
      {
        id: 'documentationLink',
        type: 'root',
        text: 'Documentation',
      },
    ];

    return primaryNavNodes;
  }
}
