/* basic reactivity */
price = 5;
quantity = 10;
total = 0;
target = null;
storage = [];

target = () => {
  total = price * quantity;
}
storage.push(target)
replay = () => {
  storage.forEach(s => s());
}

console.log(total, "initial");
price += 1;
console.log(total, "changed price");
replay();
console.log(total, "called replay manually to run subscribers");