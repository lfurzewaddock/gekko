import Navigo from 'navigo';
import type { Handler } from 'navigo';
import type { RouteIdents } from '#routing/RouterRepository';

export class RouterGateway {
  navigo?: Navigo;

  registerRoutes = async (routeConfig: Handler | Object | string) => {
    if (this.navigo) return new Promise((resolve) => setTimeout(resolve, 0));
    this.navigo = new Navigo('/');
    let self = this.navigo;
    self
      .on(routeConfig)
      .notFound(() => {})
      .resolve();

    return new Promise((resolve) => setTimeout(resolve, 0));
  };

  unload = () => {
    this.navigo?.destroy();
  };

  goToId = async (name: RouteIdents, queryString?: Object) => {
    this.navigo?.navigateByName(name, queryString);
  };
}
