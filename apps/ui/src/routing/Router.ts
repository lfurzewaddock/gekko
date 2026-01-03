import { makeObservable, computed, action } from 'mobx';

import type { ContainerDefinition } from '#ioc';
import type { RouteIdents } from '#routing/RouterRepository';

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

  updateCurrentRoute = async (newRouteId: RouteIdents | null) => {
    let oldRoute = this.routerRepository.findRoute(this.currentRoute.routeId);
    let newRoute = this.routerRepository.findRoute(newRouteId);
    const routeChanged = oldRoute.routeId !== newRoute.routeId;

    if (routeChanged) {
      this.routerRepository.onRouteChanged?.();

      if (oldRoute.onLeave) oldRoute.onLeave();
      if (newRoute.onEnter) newRoute.onEnter();
      this.routerRepository.currentRoute.routeId = newRoute.routeId;
      this.routerRepository.currentRoute.routeDef = newRoute.routeDef;
    }
  };

  registerRoutes = (onRouteChange: () => void) => {
    this.routerRepository.registerRoutes(
      this.updateCurrentRoute,
      onRouteChange,
    );
  };

  goToId = async (routeId: RouteIdents) => {
    this.routerRepository.goToId(routeId);
  };

  getCurrentLocation = () => {
    return this.routerRepository.getCurrentLocation();
  };
}
