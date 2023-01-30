import isFunction from 'lodash/isFunction';

export class EventEmitter {
  constructor() {
    this.storage = [];
  }

  subscribe(listener) {
    if (isFunction(listener)) {
      this.storage.push(listener);

      return () => this.unsubscribe(listener);
    }
    console.error('The listener must be a function');

    return () => null;
  }

  unsubscribe(listener) {
    if (isFunction(listener)) {
      this.storage = this.storage.filter((_listener) => _listener !== listener);
    } else {
      console.error('The listener must be a function');
    }
  }

  clear() {
    this.storage = [];
  }

  emit(data) {
    this.storage.forEach((item) => item(data));
  }
}
