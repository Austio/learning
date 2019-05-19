class Dep {
  constructor() {
    this.subscribers = [];
  }
  depend() {
    if (Dep.target) {
      this.subscribers.push(Dep.target);
    }
  }
  notify() {
    this.subscribers.forEach(f => f());
  }
}

function defineReactive(vm, key, initialValue) {
  let value = initialValue;
  const dep = new Dep();

  Object.defineProperty(vm, key, {
    enumberable: true,
    configurable: true,
    get() {
      dep.depend();
      return value;
    },
    set(newVal) {
      value = newVal;
      dep.notify();
    }
  })
}

function watch(func) {
  Dep.target = func;
  const v = func();
  Dep.target = null;
  return v;
}

function defineComputed(vm, key, func) {
  let value;
  const boundFunc = func.bind(vm);

  watch(() => {
    value = boundFunc()
  })

  Object.defineProperty(vm, key, {
    enumberable: true,
    configurable: true,
    get() {
      return value;
    },
    set() {
      throw('You cannot set a computed property')
    }
  })
}

class Vue {
  constructor(options = {}) {
    this._options = options;
    this.initData();
    this.initComputed();
  }

  initData() {
    const data = this._options.data || {};

    Object.keys(data).forEach(k => {
      defineReactive(this, k, data[k]);
    });
  }

  initComputed() {
    const computed = this._options.computed || {};

    Object.keys(computed).forEach(k => {
      defineComputed(this, k, computed[k]);
    });
  }
}

module.exports = Vue;
