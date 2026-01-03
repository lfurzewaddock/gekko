import { AppTestHarness } from '../AppTestHarness';

import type { RouteIdents } from '#routing/RouterRepository';
import type { ContainerDefinition } from '#ioc';

let appTestHarness: AppTestHarness;
let navigationPresenter: ContainerDefinition['NavigationPresenter'];
let router: ContainerDefinition['Router'];
let routerGateway: ContainerDefinition['RouterGateway'];

describe('navigation', () => {
  const clickOnMenuBtnId = (testlinkId: RouteIdents) => {
    router.goToId(testlinkId);
  };

  beforeEach(async () => {
    appTestHarness = new AppTestHarness();
    appTestHarness.init();
    appTestHarness.bootStrap(() => {});
    navigationPresenter = appTestHarness.container.resolve(
      'NavigationPresenter',
    );
    router = appTestHarness.container.resolve('Router');
    routerGateway = appTestHarness.container.resolve('RouterGateway');
  });

  describe('app load', () => {
    it('anchor: default redirect to homeLink state', () => {
      const testlinkId = 'homeLink';
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Home > homeLink',
      );
      expect(navigationPresenter.viewModel.currentSelectedNode).toMatchObject({
        id: testlinkId,
        type: 'root',
        text: 'Home',
      });
      expect(
        navigationPresenter.viewModel.navNodes.find(
          (node) => node.id === testlinkId,
        )?.isSelected,
      ).toBe(true);
    });
  });

  describe('navigate button clicks', () => {
    beforeEach(async () => {
      await appTestHarness.setup();
    });

    it('should navigate with 1st click on menu button, then with 2nd click on different menu button', async () => {
      const testlinkIdFirst = 'backtestLink';
      const testlinkIdSecond = 'homeLink';

      // anchor
      clickOnMenuBtnId(testlinkIdFirst);

      expect(routerGateway.goToId).toHaveBeenLastCalledWith(testlinkIdFirst);
      // check menu
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Backtest > backtestLink',
      );
      expect(navigationPresenter.viewModel.currentSelectedNode).toMatchObject({
        id: testlinkIdFirst,
        type: 'root',
        text: 'Backtest',
      });
      expect(
        navigationPresenter.viewModel.navNodes.find(
          (node) => node.id === testlinkIdFirst,
        )?.isSelected,
      ).toBe(true);
      expect(
        navigationPresenter.viewModel.navNodes.find(
          (node) => node.id === testlinkIdSecond,
        )?.isSelected,
      ).toBe(false);

      // pivot
      clickOnMenuBtnId(testlinkIdSecond);

      expect(routerGateway.goToId).toHaveBeenLastCalledWith(testlinkIdSecond);
      // check menu
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Home > homeLink',
      );
      expect(navigationPresenter.viewModel.currentSelectedNode).toMatchObject({
        id: testlinkIdSecond,
        type: 'root',
        text: 'Home',
      });
      expect(
        navigationPresenter.viewModel.navNodes.find(
          (node) => node.id === testlinkIdFirst,
        )?.isSelected,
      ).toBe(false);
      expect(
        navigationPresenter.viewModel.navNodes.find(
          (node) => node.id === testlinkIdSecond,
        )?.isSelected,
      ).toBe(true);
    });
  });
});
