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
    table.insert({ name: "jim" });
    expect(table.length).toEqual(1)
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
      .toEqual(joe);
  });
});
