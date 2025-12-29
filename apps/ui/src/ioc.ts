import { createContainer, asClass } from 'awilix';
import { HttpGateway } from '#core/HttpGateway';
import { HttpConfig } from '#core/HttpConfig';

const container = createContainer();

container.register({
  HttpConfig: asClass(HttpConfig),
  HttpGateway: asClass(HttpGateway),
});

export default container;
