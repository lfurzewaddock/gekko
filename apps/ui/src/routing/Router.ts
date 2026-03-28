import { makeObservable, computed, action } from 'mobx';

import type { ContainerDefinition } from '#ioc';
import type { Route, RouteIdents } from '#routing/RouterRepository';

export class Router {
  routerRepository;

  get currentRoute() {
    return this.routerRepository.currentRoute;
  }

  constructor(opts: ContainerDefinition) {
    this.routerRepository = opts.RouterRepository;
    makeObservable(this, {
      currentRoute: computed,
      updateCurrentRoute: action,
    });
  }

  // TODO: use type from source
  updateCurrentRoute = async (
    newRouteId: Route['routeId'],
    params?: Route['params'],
    query?: Route['query'],
  ) => {
    let oldRoute = this.routerRepository.findRoute(this.currentRoute.routeId);
    let newRoute = this.routerRepository.findRoute(newRouteId);
    const routeChanged = oldRoute.routeId !== newRoute.routeId;

    if (routeChanged) {
      this.routerRepository.onRouteChanged?.();

      if (oldRoute.onLeave) oldRoute.onLeave();
      if (newRoute.onEnter) newRoute.onEnter();
      this.routerRepository.currentRoute.routeId = newRoute.routeId;
      this.routerRepository.currentRoute.routeDef = newRoute.routeDef;
      this.routerRepository.currentRoute.params = params;
      this.routerRepository.currentRoute.query = query;
    }
  };

  registerRoutes = (onRouteChange: () => void) => {
    this.routerRepository.registerRoutes(this.updateCurrentRoute, onRouteChange);
  };

  goToId = async (routeId: RouteIdents) => {
    this.routerRepository.goToId(routeId);
  };

  getCurrentLocation = () => {
    return this.routerRepository.getCurrentLocation();
  };
}

export type UpdateCurrentRoute = Router['updateCurrentRoute'];
