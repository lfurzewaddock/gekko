import { createContainer, asClass } from 'awilix';
import { Router } from '#routing/Router';
import { AppPresenter } from '#AppPresenter';
import { RouterRepository } from '#routing/RouterRepository';
import { NavigationRepository } from '#layout/NavRepository';
import { NavigationPresenter } from '#layout/NavPresenter';
import { BacktestRepository } from '#page/Backtest/BacktestRepository';
import { BacktestPresenter } from '#page/Backtest/BacktestPresenter';
import { BacktestFormPresenter } from '#page/Backtest/BacktestFormComponent/BacktestFormPresenter';

export interface ContainerDefinition {
  RouterRepository: RouterRepository;
  Router: Router;
  AppPresenter: AppPresenter;
  NavigationRepository: NavigationRepository;
  NavigationPresenter: NavigationPresenter;
  BacktestRepository: BacktestRepository;
  BacktestPresenter: BacktestPresenter;
  BacktestFormPresenter: BacktestFormPresenter;
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
      BacktestRepository: asClass(BacktestRepository).singleton(),
      BacktestPresenter: asClass(BacktestPresenter),
      BacktestFormPresenter: asClass(BacktestFormPresenter),
    });
    return this.container;
  };
}
