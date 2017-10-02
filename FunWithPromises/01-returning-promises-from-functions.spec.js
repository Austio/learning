const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

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
    calls.push(v);
    return v;
  }

  describe('helpers', () => {
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

  it('Immediately Invokes Promises when they are defined', (done) => {
    const p1 = Promise.resolve(1).then(pushV);
    const p2 = Promise.resolve(2).then(pushV);

    return Promise.all([p1, p2])
      .then(sumArgs)
      .then(pushV)
      .then((v) => {
        expect(calls).toEqual([1,2,3]);
        done();
      });
  });

  it('Only resolves promises when we enter their execution context', (done) => {
    const p1 = () => Promise.resolve(1).then(pushV);
    const p2 = () => Promise.resolve(2).then(pushV);

    pushV('ShouldBeFirst');

    return Promise.all([p1(), p2()])
      .then(sumArgs)
      .then(pushV)
      .then((v) => {
        expect(calls).toEqual(['ShouldBeFirst',1,2,3]);
        done();
      });
  });
  
  it('Works with emits stuff with a delay', (done) => {
    const getPromisesArray = () => Promise.all([
      Promise.resolve(1).then(pushV),
      Promise.resolve(2).then(pushV),
    ]);

    const router = new EventEmitter();

    const delayedResolve = new Promise((resolve) => {
      setTimeout(function(){
          resolve('delayedResolveDone')}
        , 2500)
    })

    const promise = new Promise((resolve, reject) => {
      resolve(delayedResolve.then(pushV));
    });

    router.on('ready', () => {
      return promise.then(() => getPromisesArray().then(() => {
        expect(calls).toEqual(['delayedResolveDone', 1, 2]);
        done()
      }))
    });

    router.emit('ready');
  })
})
