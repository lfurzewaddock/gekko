import { makeObservable, observable } from 'mobx';

import type { ContainerDefinition } from '#ioc';
import type { Match } from 'navigo';

import type { UpdateCurrentRoute } from '#routing/Router';

export type Route = {
  routeId: RouteIdents | null;
  routeDef?: {
    path: string;
    isSecure?: boolean;
  };
  params?: {
    [key: string]: string;
  } | null;
  query?: string;
  onEnter?: () => void;
  onLeave?: () => void;
};

export type RouteIdents =
  | 'homeLink'
  | 'backtestLink'
  | 'liveGekkosLink'
  | 'localDataLink'
  | 'configLink'
  | 'documentationLink'
  | 'default'
  | 'loadingSpinner';

export class RouterRepository {
  currentRoute: Route = { routeId: null };

  backtestRepository;

  routerGateway;

  onRouteChanged = () => {};

  routes: Route[] = [
    {
      routeId: 'homeLink',
      routeDef: {
        path: '/ui/home',
        isSecure: false,
      },
    },
    {
      routeId: 'backtestLink',
      routeDef: {
        path: '/ui/backtest',
        isSecure: false,
      },
      onEnter: () => {
        this.backtestRepository.load();
      },
      onLeave: () => {
        this.backtestRepository.reset();
      },
    },
    {
      routeId: 'default',
      routeDef: {
        path: '*',
        isSecure: false,
      },
      onEnter: () => {},
    },
  ];

  constructor(opts: ContainerDefinition) {
    this.routerGateway = opts.RouterGateway;
    this.backtestRepository = opts.BacktestRepository;
    makeObservable(this, {
      currentRoute: observable,
    });
  }

  registerRoutes = (updateCurrentRoute: UpdateCurrentRoute, onRouteChanged: () => void) => {
    this.onRouteChanged = onRouteChanged;
    let routeConfig: Record<string, any> = {};
    this.routes.forEach((routeArg) => {
      const route = this.findRoute(routeArg.routeId);
      routeConfig[route.routeDef?.path || ''] = {
        as: route.routeId,
        uses: (match: Match) => {
          updateCurrentRoute(route.routeId, match.params, match.queryString);
        },
      };
    });

    this.routerGateway.registerRoutes(routeConfig);
  };

  findRoute(routeId: RouteIdents | null) {
    const route = this.routes.find((route) => {
      return route.routeId === routeId;
    });
    return route || { routeId: 'loadingSpinner', routeDef: { path: '' } };
  }

  goToId = async (routeId: RouteIdents) => {
    this.routerGateway.goToId(routeId);
  };

  getCurrentLocation = () => {
    return this.routerGateway.navigo?.getCurrentLocation();
  };
}
