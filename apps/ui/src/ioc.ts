import { asClass } from 'awilix';
import { HttpGateway } from '#core/HttpGateway';
import { HttpConfig } from '#core/HttpConfig';
import { RouterGateway } from '#routing/RouterGateway';
import { BaseIOC } from '#ioc-base';
import type { ContainerDefinition as ContainerDefinitionBase } from '#ioc-base';
export interface ContainerDefinition extends ContainerDefinitionBase {
  HttpConfig: HttpConfig;
  HttpGateway: HttpGateway;
  RouterGateway: RouterGateway;
}

export const container = new BaseIOC().buildBaseTemplate();

container.register({
  HttpConfig: asClass(HttpConfig).singleton(),
  HttpGateway: asClass(HttpGateway).singleton(),
  RouterGateway: asClass(RouterGateway).singleton(),
});

export default container;
