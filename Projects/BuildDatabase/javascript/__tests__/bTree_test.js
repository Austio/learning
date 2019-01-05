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

  describe(".insert()", () => {
    it("returns false if it is full", () => {
      const small = new Node({ max: 0 });

      const result = small.insert("index", 'v');
      expect(result).toEqual(false);
      expect(small.isFull).toEqual(true)
    });

    it("adds to keys/value to node", () => {
      n.insert("james", 5)

      expect(n.keys).toEqual([{
        key: "james",
        value: 5,
        child: null,
      }]);
    });

    it("adds to keys/value to node when it is less that  the current value", () => {
      const getKeys = () => n.keys.map(o => o.key)
      const getVals = () => n.keys.map(o => o.value)

      n.insert(1, "b");
      expect(getKeys()).toEqual([1]);

      n.insert(3, "d");
      expect(getKeys()).toEqual([1, 3]);

      n.insert(2, "c");
      expect(getKeys()).toEqual([1, 2, 3]);

      n.insert(4, "e");
      expect(getKeys()).toEqual([1, 2, 3, 4]);

      n.insert(0, "a");
      expect(getKeys()).toEqual([0, 1, 2, 3, 4]);

      expect(getVals()).toEqual(['a', 'b', 'c', 'd', 'e']);
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

  describe("treeInsertNonFull", () => {
    beforeEach(() => b.treeCreate());


    it("inserts a node", () => {
      b.treeInsert('jim', 6);

      expect(b.treeInspect()).toEqual([{ key: 'jim', value: 6, child: null }]);
    });
  });
});