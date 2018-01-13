flow = (
  function() {
    reduce = Array.prototype.reduce;
    slice = Array.prototype.slice;

    function series() {
      var afterFirstArg = slice.call(arguments, 1);

      reduce.call(afterFirstArg, (acc, curr) => curr(acc), arguments[0]())
    }

    return {
      series,
    }
  }
)();


describe('Flow Chapter 2.12', () => {
  describe('series', () => {
    it('executes a series of functions calling each function', () => {
      callSpy = jest.fn()
      const call = v => () => {
        callSpy(v);
        return v;
      }

      flow.series(call(1), callSpy);
      expect(callSpy.mock.calls[0][0]).toBe(1);
      expect(callSpy.mock.calls[1][0]).toBe(1);
    });
  });

});
