const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

describe('Async Await Calls', () => {
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

  const pushValue = v => {
    calls.push(v);
    return v;
  };

  describe('helpers', () => {
    it('sumArgs', () => {
      expect(sumArgs(1,2,3,4,5)).toEqual(15);
    });

    it('sumArgs with array', () => {
      expect(sumArgs([1,2,3,4,5])).toEqual(15);
    });

    it("pushValue", () => {
      pushValue(1);
      pushValue(2);

      expect(calls).toEqual([1,2]);
    })
  });

  it('Blocks while awaiting inside of the try catch block', async () => {
    const p1 = () => new Promise((resolve, reject) => {
      pushValue("promise_PreTimeout");
      setTimeout(resolve, 100);
      pushValue("promise_PostTimeout");
    });


    async function main() {
      try {
        pushValue("main_preAwait");
        await p1();
        pushValue("main_postAwait");
      }
      catch (err) {

      }
    }

    pushValue("pre_main");

    await main().then(() => {
      pushValue("main_then");
    })

    expect(calls).toEqual([
      "pre_main",
      "main_preAwait",
      "promise_PreTimeout",
      "promise_PostTimeout",
      "main_postAwait",
      "main_then",
    ]);
  });

  it('Handles promises inside of catch block', async () => {
    const p1 = () => new Promise((resolve, reject) => {
      pushValue("promise_reject");
      setTimeout(reject, 100);
    });

    async function main() {
      try {
        pushValue("main_preAwait");
        await p1();
        pushValue("main_neverGetsHere");
      }
      catch (err) {
        pushValue("catch");
      }
      finally {
        pushValue("finally")
      }

    }

    await main().then(() => {
      pushValue("main_then");
    })

    expect(calls).toEqual([
      "main_preAwait",
      "promise_reject",
      "catch",
      "finally",
      "main_then",
    ]);
  });

});
