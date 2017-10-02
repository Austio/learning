describe('Properly Returning Promise from Function', () => {
  let calls;

  function sumArgs() {
    const args = Array.isArray(arguments[0])
      ? arguments[0]
      : Array.prototype.slice.call(arguments, 0);

    return args.reduce((acc, curr) => curr + acc, 0);
  }

  beforeEach(() => {
    calls = [];
  });

  const pushV = v => {
    console.log(v);
    calls.push(v);
    return v;
  }

  xdescribe('helpers', () => {
    it('sumArgs', () => {
      expect(sumArgs(1,2,3,4,5)).toEqual(15);
    });

    it('sumArgs with array', () => {
      expect(sumArgs([1,2,3,4,5])).toEqual(15);
    });

    it("pushV", () => {
      pushV(1);
      pushV(2);

      expect(calls).toEqual([1,2]);
    })
  });

  it('Immediately Invokes Promises when they are defined', () => {
    const p1 = Promise.resolve(1).then(pushV);
    const p2 = Promise.resolve(2).then(pushV);

    return Promise.all([p1, p2])
      .then(sumArgs)
      .then(v => {
        console.log('sum', v);
        return v;
      })
      .then(pushV)
      .then((v) => {
        console.log(v);
        expect(calls).toEqual([1,2,3]);
      });
  })
})
