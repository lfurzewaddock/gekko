import { useEffect } from 'react';
import { observer } from 'mobx-react';

import { useDependency } from '#core/hooks/use-dependency';
import Layout from '#layout/Layout';
import PageHomeComponent from '#page/HomeComponent';
import PageBacktestComponent from '#page/Backtest/BacktestComponent';
import PageNotFoundComponent from '#page/NotFoundComponent';

import type { ContainerDefinition } from '#ioc';
import type { RouteIdents } from '#routing/RouterRepository';

function App() {
  const presenter =
    useDependency<ContainerDefinition['AppPresenter']>('AppPresenter');

  useEffect(() => {
    presenter.load(onRouteChange);
  }, []);

  const onRouteChange = () => {};

  const renderedComponents: {
    id: RouteIdents;
    component: React.ReactNode;
  }[] = [
    {
      id: 'homeLink',
      component: <PageHomeComponent key="homePage" />,
    },
    {
      id: 'backtestLink',
      component: <PageBacktestComponent key="backtestPage" />,
    },
    {
      id: 'default',
      component: <PageNotFoundComponent key="notFoundPage" />,
    },
  ];

  return (
    <Layout>
      {renderedComponents.map(
        (current) =>
          presenter.currentRoute.routeId === current.id && current.component,
      )}
    </Layout>
  );
}

export default observer(App);
