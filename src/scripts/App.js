import AppView from './view/AppView';

export default class App {

  constructor(el) {
    this.el = el;
    this.listeners = {};

    this.initView();
  }

  initView() {
    this.view = new AppView();
  }

  on(type, cb) {
    this.listeners[type] = this.listeners[type] || [];
    if (this.listeners[type].indexOf(cb) === -1) {
      this.listeners[type].push(cb);
    }
  }

  off(type, cb) {
    if (this.listeners[type]) {
      if (cb) {
        const index = this.listeners[type].indexOf(cb);
        if (index !== -1) {
          this.listeners[type].splice(index, 1);
        }
      } else this.listeners[type] = [];
    }
  }

  trigger(type, args) {
    if (this.listeners[type]) {
      for (const cb of this.listeners[type]) {
        cb(args);
      }
    }
  }
}
