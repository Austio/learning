const { BTree, Node } = require('../BTree');

describe("BTree", () => {
  it('insert into full node', () => {
    const b = new BTree();

    b.insert(1, 'value');
    b.insert(2, 'value');
    b.insert(3, 'value');
    b.insert(4, 'value');

    expect(b.inspect()).toEqual({
      children: [
        { children: [], keys: [1] },
        { children: [], keys: [3,4] }
      ],
      keys: [2],
    });
  });

  it('search', () => {
    const b = new BTree();

    b.insert(1, '1');
    b.insert(2, '2');
    b.insert(3, '3');
    b.insert(4, '4');

    expect(b.search(2)).toEqual({ key: 2, value: '2' });
    expect(b.search(4)).toEqual({ key: 4, value: '4' });
    expect(b.search(999)).toBe(null);
  });
});