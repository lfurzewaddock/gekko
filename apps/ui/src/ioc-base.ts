import { type AwilixContainer, createContainer, asClass } from 'awilix';
import { Router } from '#routing/Router';
import { AppPresenter } from '#AppPresenter';
import { RouterRepository } from '#routing/RouterRepository';
import { NavigationRepository } from '#layout/NavRepository';
import { NavigationPresenter } from '#layout/NavPresenter';
import { BacktestRepository } from '#page/Backtest/BacktestRepository';
import { BacktestPresenter } from '#page/Backtest/BacktestPresenter';
import { BacktestFormPresenter } from '#page/Backtest/BacktestForm/BacktestFormPresenter';
import { BacktestChartPresenter } from '#page/Backtest/BacktestChart/BacktestChartPresenter';
import { MessagesPresenter } from '#core/Messages/MessagesPresenter';
import { MessagesRepository } from '#core/Messages/MessagesRepository';

export interface ContainerDefinition {
  RouterRepository: RouterRepository;
  NavigationRepository: NavigationRepository;
  Router: Router;
  BacktestRepository: BacktestRepository;
  MessagesRepository: MessagesRepository;
  AppPresenter: AppPresenter;
  NavigationPresenter: NavigationPresenter;
  BacktestPresenter: BacktestPresenter;
  BacktestFormPresenter: BacktestFormPresenter;
  BacktestChartPresenter: BacktestChartPresenter;
  MessagesPresenter: MessagesPresenter;
}

export class BaseIOC {
  container: AwilixContainer<ContainerDefinition>;

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
      BacktestRepository: asClass(BacktestRepository).singleton(),
      MessagesRepository: asClass(MessagesRepository).singleton(),
      AppPresenter: asClass(AppPresenter),
      NavigationPresenter: asClass(NavigationPresenter),
      BacktestPresenter: asClass(BacktestPresenter),
      BacktestFormPresenter: asClass(BacktestFormPresenter),
      BacktestChartPresenter: asClass(BacktestChartPresenter),
      MessagesPresenter: asClass(MessagesPresenter),
    });
    return this.container;
  };
}
