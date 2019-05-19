/* Replacing with Dep class */
class Dep {
  constructor() {
    this.subscribers = []
  }

  notify() {
    this.subscribers.forEach(s => s());
  }

  depend(target) {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
}

function defineReactive(o, k) {
  let value = o[k];
  const dep = new Dep();
  return Object.defineProperty(o, k, {
    configurable: true,
    enumerable: true,
    get() {
      dep.depend(Dep.target);

      return value;
    },
    set(newVal) {
      value = newVal;

      dep.notify();
    },
  })
}

function watcher(func) {
  Dep.target = func;
  Dep.target();
  Dep.target = null;
}

const vm = {
  price: 5,
  quantity: 10
};

defineReactive(vm, "price");
defineReactive(vm, "quantity");

total = 0;
watcher(() => {
  total = vm.price * vm.quantity
});

console.log(total, "initial");
vm.price += 1;
console.log(total, "changed price");
vm.quantity += 1;
console.log(total, "changed quantity");
