

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

  addKey(key, value) {
    if (this.isFull) return false;

    let keyIndex = null;
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].key >= key) {
        keyIndex = i;
        break;
      }
    }

    const newKey = { key, value };
    (keyIndex === null)
      ? this.keys.push(newKey)
      : this.keys.splice(keyIndex, 0, newKey);

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
    this.root = new Node({ isLeaf: true });
  }

  /*
  https://webdocs.cs.ualberta.ca/~holte/T26/ins-b-tree.html
  t: numebr of keys on a node, t is minimum per node
  lowerBound: every node besides root must have t -1 keys and t children
  upperBound: every node has at most 2t -1 keys, internal node has at most 2t children

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

  treeSplit()
}

module.exports = {
  BTree,
  Node,
};
