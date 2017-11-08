describe('constructors', () => {
  it('implicitly returns this when nothing returned', () => {
    function Person() {
      this.name = 'john'
    }

    const john = new Person();

    expect(typeof john).toBe('object');
    expect(john.name).toBe('john');
  });
})

