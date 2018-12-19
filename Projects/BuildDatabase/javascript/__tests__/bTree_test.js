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

  describe(".addIndex()", () => {
    it("returns false if it is full", () => {
      const small = new Node({ max: 0 });

      const result = small.addIndex("index", 'v');
      expect(result).toEqual(false);
      expect(small.isFull).toEqual(true)
    });

    it("adds to keys/value to node", () => {
      n.addIndex("james", 5)

      expect(n.keys).toEqual([{
        index: "james",
        value: 5,
      }]);
    });

    it("adds to keys/value to node when it is less that  the current value", () => {
      const getKeys = () => n.keys.map(o => o.index)

      n.addIndex(1, "v");
      expect(getKeys()).toEqual([1]);

      n.addIndex(3, "v");
      expect(getKeys()).toEqual([1, 3]);

      n.addIndex(2, "v");
      expect(getKeys()).toEqual([1, 2, 3]);

      n.addIndex(4, "v");
      expect(getKeys()).toEqual([1, 2, 3, 4]);

      n.addIndex(0, "v");
      expect(getKeys()).toEqual([0, 1, 2, 3, 4]);
    });
  });
});

describe("BTree", () => {
  let b;
  beforeEach(() => { b = new BTree()} );
  afterEach(() => { b = new BTree()} );

  it("treeCreate", () => {
     b.treeCreate();

     expect(b.root.isLeaf).toEqual(true);
  });

  describe("treeInsert", () => {
    beforeEach(() => b.treeCreate());

    it("inserts a node", () => {
      b.treeInsert('jim', 6)

    });
  });
});