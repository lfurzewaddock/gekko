import { makeObservable, observable } from 'mobx';

import type { ContainerDefinition } from '#ioc';
import type { Match } from 'navigo';

export type Route = {
  routeId: RouteIdents | null;
  routeDef?: {
    path: string;
    isSecure?: boolean;
  };
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
    makeObservable(this, {
      currentRoute: observable,
    });
  }

  registerRoutes = (
    updateCurrentRoute: (
      newRouteId: RouteIdents | null,
      params: any,
      query: any,
    ) => Promise<void>,
    onRouteChanged: () => void,
  ) => {
    this.onRouteChanged = onRouteChanged;
    let routeConfig: Record<string, any> = {};
    this.routes.forEach((routeArg) => {
      const route = this.findRoute(routeArg.routeId);
      routeConfig[route.routeDef?.path || ''] = {
        as: route.routeId,
        uses: (match: Match) => {
          updateCurrentRoute(route.routeId, route.routeDef, match.queryString);
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
