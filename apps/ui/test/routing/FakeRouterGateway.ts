import type { Handler } from 'navigo';

import type { RouteIdents } from '#routing/RouterRepository';

export class FakeRouterGateway {
  registerRoutes = async (_routeConfig: Handler | Object | string) => {};

  unload = () => {};

  goToId = async (_routeId: RouteIdents) => {};
}
