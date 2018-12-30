
class Node {
  constructor(options = {}) {
    this.max = Object.keys(options).includes('max') ? options.max : 100;
    this.keys = [];
    this.childNodes = null;
    this.isLeaf = options.isLeaf || true;
  }

  get isFull() {
    return this.keys.length >= this.max;
  }

  addIndex(newIndex, newValue) {
    if (this.isFull) return false;

    const newIndexItem = { index: newIndex, value: newValue };
    if (this.keys.length === 0) {
      this.keys.unshift(newIndexItem);
      return true;
    }

    let newIndexItemIndex = null;
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].index >= newIndex) {
        newIndexItemIndex = i;
        break;
      }
    };

    (newIndexItemIndex === null)
      ? this.keys.push(newIndexItem)
      : this.keys.splice(newIndexItemIndex, 0, newIndexItem);

    return true;
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
    this.root = new Node({ isLeaf: false });
  }

  /*
  r:
  x: node
  n[x]: Number of nodes at a tree, also key(i)[x]
  cn[x]: Pointer to leaf
  key(i)[x]: i is subscript.  In a node, the value

   */
  treeInsert(index, value) {
    // this.root.insert(index, value)
  }

  treeInsertNonFull(index, value) {

  }
}

module.exports = {
  BTree,
  Node,
};
