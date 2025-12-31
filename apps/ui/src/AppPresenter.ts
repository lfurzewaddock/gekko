import { makeObservable, computed } from 'mobx';

import type { ContainerDefinition } from '#ioc';

export class AppPresenter {
  router;

  get currentRoute() {
    return this.router.currentRoute;
  }

  constructor(opts: ContainerDefinition) {
    this.router = opts.Router;
    makeObservable(this, {
      currentRoute: computed,
    });
  }

  load = (onRouteChange: () => void) => {
    const onRouteChangeWrapper = () => {
      onRouteChange();
    };
    this.router.registerRoutes(onRouteChangeWrapper);

    // redirect to home only if at app root
    const currentLocation = this.router.getCurrentLocation();
    if (currentLocation?.url === '') this.router.goToId('homeLink');
  };
}
