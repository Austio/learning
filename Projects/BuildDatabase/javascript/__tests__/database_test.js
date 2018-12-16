const Table = require('../database').Table;

describe("Table", () => {
  let table = null;
  beforeEach(() => { table = new Table() });
  afterEach(() => { table = null });
  it("starts with 0 length", () => {
    expect(table.length).toEqual(0);
  });

  it(".insert()", () => {
    expect(table.length).toEqual(0);
    const jim = table.insert({ name: "jim" });
    const joe = table.insert({ name: "joe" });

    expect(table.length).toEqual(2);

    expect(jim.id).toEqual(1);
    expect(joe.id).toEqual(2);
  });

  it(".findById()", () => {
    table.insert({ name: "jim" });
    const joe = table.insert({ name: "joe" });

    expect(table.findById(joe.id))
      .toEqual(joe);
  });

  it(".findBy(attribute, valee)", () => {
    table.insert({ name: "jim" });
    const joe = table.insert({ name: "joe" });

    expect(table.findBy('name', joe.name))
      .toEqual([ joe ]);
  });

  it(".findBy(attribute, valee) finds all values", () => {
    table.insert({ name: "jim" });
    const joe1 = table.insert({ name: "joe" });
    const joe2 = table.insert({ name: "joe" });


    expect(table.findBy('name', "joe"))
      .toEqual([joe1, joe2 ]);
  });

  describe("indexes", () => {
    it(".createIndex()", () => {
      table.createIndex('name');

      expect(table.indices.name).toEqual({})
    });

    it(".indexObject()", () => {
      table.createIndex('name');

      table.indexObject('name', { name: 'jim', id: 5 });
      expect(table.indices.name.jim).toEqual(5);
    });

    it('pushes to the index when inserting a record attribute', () => {
      table.createIndex('name');

      const obj = table.insert({ name: "jim" });
      expect(table.indices.name["jim"]).toEqual(obj.id)
    })
  });
});
