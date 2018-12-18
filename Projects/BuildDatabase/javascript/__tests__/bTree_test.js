const { BTree, Node } = require('../BTree');

describe("Node", () => {
  let n;
  beforeEach(() => { n = new Node() });
  afterEach(() => { n = null });


  it("initializes", () => {
    expect(n.keys).toEqual([])
    expect(n.numKeys).toEqual(0)
    expect(n.isLeaf).toEqual(true)
  });

  it("isLeaf initialize and setting", () => {
    const n = new Node({ isLeaf: false })
    expect(n.isLeaf).toEqual(true)
  });

  describe(".insertKey()", () => {
    it("adds to keys/value to node", () => {
      n.insertKey("james", 5)

      expect(n.keys).toEqual([{
        key: "james",
        value: 5,
      }]);
    });
  });
});

describe("BTree", () => {
  let b;
  beforeEach(() => { b = new BTree()} )
  afterEach(() => { b = new BTree()} )

  it("treeCreate", () => {
     b.treeCreate();

     expect(b.root.isLeaf).toEqual(true);
  });

  describe("treeInsert", () => {
    beforeEach(() => b.treeCreate())

    it("inserts a node", () => {

    });
  });
});