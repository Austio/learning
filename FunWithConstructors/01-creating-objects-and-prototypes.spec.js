describe('constructors', () => {
  it('implicitly returns this when nothing returned', () => {
    function Person() {
      this.name = 'john'
    }

    const john = new Person();

    expect(typeof john).toBe('object');
    expect(john.name).toBe('john');
  });

  it('does not respect the return word', () => {
    function Person() {
      this.name = 'john'

      return 1;
    }

    const john = new Person();
    expect(john.name).toBe('john');
  });

  it('allows arguments', () => {
    function Person(name) {
      this.name = name || 'john'
    }

    const jane = new Person('jane');
    expect(jane.name).toBe('jane');
  })
})

