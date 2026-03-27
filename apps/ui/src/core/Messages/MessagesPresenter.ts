import { makeObservable, action, computed } from 'mobx';

import type { ContainerDefinition } from '#ioc';
import { type Result, isSuccess } from '#util/error';

export class MessagesPresenter {
  messagesRepository;

  get isHideUiAlert() {
    return this.messagesRepository.isHideUiAlert;
  }

  get messages() {
    return this.messagesRepository.appMsgs;
  }

  get hasIoFailMsg() {
    return this.messagesRepository.hasIoFailMsg;
  }

  constructor(opts: ContainerDefinition) {
    this.messagesRepository = opts.MessagesRepository;
    makeObservable(this, {
      hasIoFailMsg: computed,
      messages: computed,
      isHideUiAlert: computed,
      unpackRepoDmToVm: action,
      hideUiAlert: action,
      init: action,
    });
  }

  init = () => {
    this.messagesRepository.hasIoFailMsg = false;
    this.messagesRepository.isHideUiAlert = false;
    this.messagesRepository.appMsgs = [];
  };

  hideUiAlert = () => (this.messagesRepository.isHideUiAlert = true);

  unpackRepoDmToVm = <T, E = Error>({
    dm,
    successMsg = '',
    mapResultToErrorMsg,
  }: {
    dm: Result<T, E> | Result<T, E>[];
    successMsg?: string;
    mapResultToErrorMsg?: (error: Result<T, E>) => string[];
  }) => {
    this.messagesRepository.appMsgs = [];
    const appMsgs = (dm: Result<T, E>) => [
      ...(this.messagesRepository.appMsgs || []),
      ...(mapResultToErrorMsg != null
        ? mapResultToErrorMsg(dm)
        : [(dm.error instanceof Error && dm.error.message) || 'UNKOWN_ERROR']),
    ];

    if (Array.isArray(dm)) {
      dm.forEach((model) => {
        if (!isSuccess(model)) {
          this.messagesRepository.hasIoFailMsg = true;
          this.messagesRepository.appMsgs = appMsgs(model);
        }
      });
      if (!this.messagesRepository.hasIoFailMsg && successMsg.length)
        this.messagesRepository.appMsgs = [successMsg];
      return;
    } else {
      this.messagesRepository.hasIoFailMsg = !isSuccess(dm);
      if (isSuccess(dm) && successMsg.length) {
        this.messagesRepository.appMsgs = [successMsg];
        return;
      }
      this.messagesRepository.appMsgs = appMsgs(dm);
    }
  };
}
