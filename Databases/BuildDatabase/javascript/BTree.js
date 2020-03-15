

class Node {
  constructor(options = {}) {
    this.degrees = options.degrees || 2;
    this.children = [];
    this.values = [];
    this.keys = [];
  }

  inspect() {
    return {
      keys: this.keys,
      children: this.children.map(c => c.inspect())
    };
  }

  isFull() {
    const maxKeys = (this.degrees * 2) - 1;

    return this.keys.length >= maxKeys;
  }

  isLeaf() {
    return this.children.length === 0;
  }

  insert(i, key, value, smallerChild, largerChild) {
    if (i == null) {
      i = 0;
      while (key > this.keys[i]) i++;
    }

    this.keys.splice(i, 0, key);
    this.values.splice(i, 0, value);

    if (smallerChild) {
      this.children.splice(i, 0, smallerChild)
    }


    if (largerChild) {
      this.children.splice(i + 1, 0, largerChild)
    }
  }
}

class BTree {
  constructor() {
    this.root = this.allocateNode();
    this.degrees = 2;
  }

  inspect() {
    return this.root.inspect();
  }

  insert(key, value, node = this.root) {
    if (this.root.isFull()) {
      const oldRoot = this.root;
      this.root = this.allocateNode();

      this.split(this.root, this.degrees - 1, oldRoot);
      node = this.root;
    }

    let i = 0;
    while (key > node.keys[i]) i++;

    if (node.isLeaf()) {
      node.insert(i, key, value)
    } else {
      this.insert(key, value, node.children[i]);
    }
  }

  allocateNode() {
    return new Node({ degrees: this.degrees });
  }

  search(key, node = this.root) {
    let i = 0;
    while (key > node.keys[i]) i++;

    if (key == node.keys[i]) {
      return {
        key: node.keys[i],
        value: node.values[i]
      }
    }

    if (node.isLeaf()) return null;
    return this.search(key, node.children[i])
  }

  // x non-full parent
  // i is index to split at
  // y full child of x
  split(x, i, y) {
    const z = this.allocateNode();

    z.keys = y.keys.splice(i + 1);
    z.values = y.values.splice(i + 1);
    z.children = y.children.splice(i + 1);

    x.insert(null, y.keys.pop(), y.values.pop(), y, z);
  }
}

module.exports = {
  BTree,
  Node,
};
