
class Table {
  constructor() {
    this.store = [];
    this.indices = {};
  }

  get indexedKeys() {
    return Object.keys(this.indices);
  }

  get storeKeys() {
    return Object.keys(this.store);
  }

  insert(obj) {
    obj.id = this.length + 1;
    this.store.push(obj);

    this.indexedKeys.forEach((index) => {
      this.indexObject(index, obj);
    });

    return obj;
  }

  findById(id) {
    console.log(this.store);
    return this.store[id - 1];
  }

  findBy(attr, value) {
    return this.store.filter(elm => {
      return elm[attr] === value
    });
  }

  createIndex(attr) {
    this.indices[attr] = this.indices[attr] || {};
  }

  indexObject(maybeIndex, obj) {
    if (!this.indices[maybeIndex]) return;

    const key = obj[maybeIndex];

    this.indices[maybeIndex][key] = obj.id;
  }

  get length() {
    return this.store.length;
  }
}

module.exports.Table = Table;
