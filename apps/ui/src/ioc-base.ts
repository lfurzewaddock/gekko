import { createContainer, asClass } from 'awilix';
import { Router } from '#routing/Router';
import { AppPresenter } from '#AppPresenter';
import { RouterRepository } from '#routing/RouterRepository';
import { NavigationRepository } from '#layout/NavRepository.ts';
import { NavigationPresenter } from '#layout/NavPresenter.ts';

export interface ContainerDefinition {
  RouterRepository: RouterRepository;
  Router: Router;
  AppPresenter: AppPresenter;
  NavigationRepository: NavigationRepository;
  NavigationPresenter: NavigationPresenter;
}

export class BaseIOC {
  container;

  constructor() {
    this.container = createContainer({
      strict: true,
    });
  }

  buildBaseTemplate = () => {
    this.container.register({
      RouterRepository: asClass(RouterRepository).singleton(),
      NavigationRepository: asClass(NavigationRepository).singleton(),
      Router: asClass(Router).singleton(),
      AppPresenter: asClass(AppPresenter),
      NavigationPresenter: asClass(NavigationPresenter),
    });
    return this.container;
  };
}
