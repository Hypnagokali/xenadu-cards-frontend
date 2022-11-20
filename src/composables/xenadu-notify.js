import { Notify } from "quasar";

export const XenaduNotify = {
  info: (msg = 'info') => {
    Notify.create({
      message: msg,
      color: 'primary'
    });
  },
  warning: (msg = 'warning') => {
    Notify.create({
      message: msg,
      color: 'warning',
      classes: 'text-black',
    });
  },
  error: (msg = 'error') => {
    Notify.create({
      message: msg,
      color: 'negative',
    });
  }
};
