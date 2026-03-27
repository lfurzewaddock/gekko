import { observer } from 'mobx-react';

import { useDependency } from '#core/hooks/use-dependency';
import { useValidation } from '#core/providers/Validation';
import MessageAlertComponent from '#core/Messages/MessageAlertComponent';

import type { ContainerDefinition } from '#ioc';

export const MessagesComponent = observer(() => {
  let [uiMessages] = useValidation();
  const presenter = useDependency<ContainerDefinition['MessagesPresenter']>('MessagesPresenter');

  return (
    <>
      <MessageAlertComponent
        messages={presenter.messages}
        hasFailMsg={presenter.hasIoFailMsg}
        hideAlert={presenter.hideUiAlert}
        isHideAlert={presenter.isHideUiAlert}
      />

      {uiMessages &&
        uiMessages.map((item, idx) => {
          return (
            <div style={{ backgroundColor: 'orange' }} key={idx}>
              {' - '}
              {item}
            </div>
          );
        })}
    </>
  );
});
