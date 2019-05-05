const Vue = require('./tinyVue');

describe.only("tinyVue: building reactivity from scratch", () => {
  let vm;

  beforeEach(() => {
    vm = new Vue({
      data: {
        price: 1,
        quantity: 2,
      },
      computed: {
        total() {
          return this.price * this.quantity;
        }
      }
    });
  })

  it("responds to propertys on root for items in data", () => {
    expect(vm.price).toEqual(1)
    expect(vm.quantity).toEqual(2)
  });
  it("has setters that work", () => {
    expect(vm.price).toEqual(1);
    vm.price = 15;
    expect(vm.price).toEqual(15);
  });

  it("reactively updates values", () => {
    expect(vm.total).toEqual(2);
    vm.price = 15;
    vm.quantity = 10;
    expect(vm.total).toEqual(150);
  });
});