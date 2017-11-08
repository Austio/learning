describe('constructors', () => {
  describe('behavior', () => {
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
  });
  describe('Function constructor', () => {
    it('creates in global context and does not respect closure')
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
  })
})

