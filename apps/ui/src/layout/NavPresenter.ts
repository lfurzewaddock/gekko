import { computed, makeObservable } from 'mobx';
import type { ContainerDefinition } from '#ioc';
import type { NavNode } from '#layout/NavRepository';

export class NavigationPresenter {
  navigationRepository;

  routerRepository;

  get viewModel() {
    console.log(
      'this.navigationRepository.currentNode',
      this.navigationRepository.currentNode,
    );
    const vm = {
      currentSelectedVisibleName: '',
      currentSelectedNode: this.navigationRepository.getPrimaryNavNodes()[0],
      navNodes: this.navigationRepository.getPrimaryNavNodes().map((node) => {
        return {
          id: node.id,
          text: node.text,
          isSelected: this.navigationRepository.currentNode?.id === node.id,
        };
      }),
    };

    let currentNode = this.navigationRepository.currentNode;
    console.log('currentNode', currentNode);

    if (currentNode) {
      vm.currentSelectedVisibleName = this.visibleName(currentNode);
      vm.currentSelectedNode = currentNode;
    }

    return vm;
  }

  constructor(opts: ContainerDefinition) {
    this.navigationRepository = opts.NavigationRepository;
    this.routerRepository = opts.RouterRepository;
    makeObservable(this, {
      viewModel: computed,
    });
  }

  visibleName = (node: NavNode) => {
    return node.text + ' > ' + node.id;
  };
}
