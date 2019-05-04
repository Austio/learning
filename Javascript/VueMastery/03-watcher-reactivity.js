/* Replacing with Dep class */
class Dep {
  constructor() {
    this.subscribers = []
  }

  notify() {
    this.subscribers.forEach(s => s());
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
}

dep = new Dep();
target = null;

function watcher(func) {
  target = func;
  dep.depend();
  target();
  target = null;
}

price = 5;
quantity = 10;
total = 0;
watcher(() => {
  total = price * quantity
})

console.log(total, "initial");
price += 1;
console.log(total, "changed price");
dep.notify();
console.log(total, "called dep.notify manually");
