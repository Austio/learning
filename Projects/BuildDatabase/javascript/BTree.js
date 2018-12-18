
class Node {
  constructor(options = {}) {
    this.keys = [];
    this.childNodes = null;
    this.isLeaf = options.isLeaf || true;
  }

  insertKey(indexKey, id) {
    this.keys.push({ key: indexKey, value: id });
  }

  get numKeys() {
    return this.keys.length;
  }
}

class BTree {
  constructor() {
    this.root = null;
  }

  treeCreate() {
    this.root = new Node();
  }

  /*
  r:
  x: node
  n[x]: Number of nodes at a tree
  cn[x]: Pointer to leave
   */
  treeInsert({ key, value }) {
    this.root.insert({ key, value })
  }
}

module.exports = {
  BTree,
  Node,
};
