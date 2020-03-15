
class Table {
  constructor() {
    this.store = [];
    this.indices = {};

    this.findById = this.findById.bind(this);
  }

  get indexedKeys() {
    return Object.keys(this.indices);
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
    return this.store[id - 1];
  }

  findBy(attr, value) {
    return this.hasIndexFor(attr)
      ? this.findByIndex(attr, value)
      : this.findByTableScan(attr, value)
  }

  hasIndexFor(attr) {
    return this.indexedKeys.includes(attr);
  }

  findByIndex(attr, value) {
    var index = this.indices[attr];
    // TODO here should raise if this is undefined

    var ids = index[value] || [];
    return ids.map(this.findById)
  }

  findByTableScan(attr, value) {
    return this.store.filter(elm => {
      return elm[attr] === value
    });
  }

  createIndex(attr) {
    this.indices[attr] = this.indices[attr] || [];
  }

  indexObject(indexName, obj) {
    const index = this.indices[indexName];
    if (!index) return;
    // TODO should throw here on index if it doesn't exist

    const key = obj[indexName];

    index[key] = index[key] || [];
    index[key].push(obj.id);
  }

  get length() {
    return this.store.length;
  }
}

module.exports.Table = Table;
