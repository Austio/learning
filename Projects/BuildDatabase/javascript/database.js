
class Table {
  constructor() {
    this.lastId = 0;
    this.store = {}
  }

  insert(obj) {
    this.lastId += 1;
    obj.id = this.lastId;
    this.store[this.lastId] = obj;

    return obj;
  }

  findById(id) {
    return this.store[id];
  }

  findBy(attr, value) {
    const keys = Object.keys(this.store);

    for(let i = 1; i <= keys.length; i++) {
      if (this.store[i][attr] === value) {
        return this.store[i];
      }
    }
  }

  get length() {
    return this.lastId
  }
}

module.exports.Table = Table;
