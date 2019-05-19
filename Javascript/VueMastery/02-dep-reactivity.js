/* Replacing with Dep class */
target = null;

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

price = 5;
quantity = 10;
total = 0;
target = () => {
  total = price * quantity
}
dep = new Dep();
dep.depend();
target();

console.log(total, "initial");
price += 1;
console.log(total, "changed price");
dep.notify();
console.log(total, "called dep.notify manually");