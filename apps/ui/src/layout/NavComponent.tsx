import { observer } from 'mobx-react';
import { clsx } from 'clsx/lite';

import NavMenuBtn from '#layout/NavMenuBtn';
import { useDependency } from '#core/hooks/use-dependency';
import type { ContainerDefinition } from '#ioc';

function NavComponent() {
  const presenter = useDependency<ContainerDefinition['NavigationPresenter']>(
    'NavigationPresenter',
  );
  const router = useDependency<ContainerDefinition['Router']>('Router');

  return (
    <div className="w-full max-w-8/10 h-full">
      <div className="flex flex-row justify-evenly h-full">
        {presenter.viewModel.navNodes.map((node) => (
          <NavMenuBtn key={node.id}>
            <a
              className={clsx(
                node.isSelected ? 'bg-white' : 'hover:bg-white',
                'block',
                'cursor-pointer',
                'pt-4',
                'pb-4',
              )}
              onClick={() => router.goToId(node.id)}
            >
              {node.text}
            </a>
          </NavMenuBtn>
        ))}
      </div>
    </div>
  );
}

export default observer(NavComponent);
