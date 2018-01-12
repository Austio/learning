flow = (
  function() {
    forEach = Array.prototype.forEach;

    function series() {
      forEach.call(arguments, arg => arg())
    }

    return {
      series,
    }
  }
)();


describe('Flow Chapter 2.12', () => {
  describe('series', () => {
    it('executes a series of functions 1 after the other', () => {
      callSpy = jest.fn()
      const call = v => () => callSpy(v);

      flow.series(call(1), call(2));
      expect(callSpy.mock.calls[0][0]).toBe(1);
      expect(callSpy.mock.calls[1][0]).toBe(2);
    });
  });
});
