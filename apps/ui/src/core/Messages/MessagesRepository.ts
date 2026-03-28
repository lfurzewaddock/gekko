import { makeObservable, observable } from 'mobx';

export class MessagesRepository {
  appMsgs: string[] | null = null;
  hasIoFailMsg: boolean | null = null;
  isHideUiAlert: boolean | null = null;

  constructor() {
    makeObservable(this, {
      appMsgs: observable,
      hasIoFailMsg: observable,
      isHideUiAlert: observable,
    });
    this.reset();
  }

  reset = () => {
    this.appMsgs = [];
    this.hasIoFailMsg = false;
    this.isHideUiAlert = false;
  };
}
