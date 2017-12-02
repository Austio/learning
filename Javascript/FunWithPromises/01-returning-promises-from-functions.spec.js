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

  it('Immediately Invokes Promises when they are defined', (done) => {
    const p1 = Promise.resolve(1).then(pushValue);
    const p2 = Promise.resolve(2).then(pushValue);

    return Promise.all([p1, p2])
      .then(sumArgs)
      .then(pushValue)
      .then((v) => {
        expect(calls).toEqual([1,2,3]);
        done();
      });
  });

  it('Only resolves promises when we enter their execution context', (done) => {
    const p1 = () => Promise.resolve(1).then(pushValue);
    const p2 = () => Promise.resolve(2).then(pushValue);

    pushValue('ShouldBeFirst');

    return Promise.all([p1(), p2()])
      .then(sumArgs)
      .then(pushValue)
      .then((v) => {
        expect(calls).toEqual(['ShouldBeFirst',1,2,3]);
        done();
      });
  });

  describe('promise.resolve', () => {
    it('resolves', async () => {
      await Promise.resolve('foo').then(pushValue);

      expect(calls).toEqual(['foo']);
    });

    it('is the same as creating a new Promise that resolves', async () => {
      await new Promise((resolve) => resolve('foo')).then(pushValue);

      expect(calls).toEqual(['foo']);
    })
  });

  describe('.then functionality', () => {
    it('result promise resolves to value', async () => {
      await Promise.resolve('first').then(pushValue);

      expect(calls).toEqual(['first']);
    });

    it('chained promises', async () => {
      await Promise
        .resolve('first')
        .then(val => {
          pushValue(val);
          return 'second';
        })
        .then(pushValue);

      expect(calls).toEqual(['first', 'second']);
    });

    it('value assumes the value of thenables that are passed in', async () => {
      const nestedThenable = (initialValue) =>
        Promise
          .resolve(initialValue)
          .then(val => `${val}-2`)
          .then(nextVal => `${nextVal}-3`);

        pushValue('first');

        await Promise
          .resolve('nested')
          .then(nestedThenable)
          .then(pushValue);

        expect(calls).toEqual(['first', 'nested-2-3']);
    });

    it('respects a promise that takes a bit to resolve', async () => {
      const nestedThenable = (initialValue) =>
        Promise
          .resolve(initialValue)
          .then(val => `${val}-2`)
          .then(nextVal => `${nextVal}-3`);

      pushValue('first');

      await Promise
        .resolve('value')
        .then((value) => new Promise((resolve, reject) => setTimeout(resolve(nestedThenable(value)), 500)))
        .then(pushValue);

      expect(calls).toEqual(['first', 'value-2-3']);
    });
  });

  describe('resolving as part of an emitter', () => {
    it('Works with emits stuff with a delay', (done) => {
      const getPromisesArray = () => Promise.all([
        Promise.resolve(1).then(pushValue),
        Promise.resolve(2).then(pushValue),
      ]);

      const router = new EventEmitter();

      const delayedResolve = new Promise((resolve) => {
        setTimeout(function(){
            resolve('delayedResolveDone')}
          , 2500)
      })

      const promise = new Promise((resolve, reject) => {
        resolve(delayedResolve.then(pushValue));
      });

      router.on('ready', () => {
        return promise.then(() => getPromisesArray().then(() => {
          expect(calls).toEqual(['delayedResolveDone', 1, 2]);
          done()
        }))
      });

      router.emit('ready');
    });
  });
})
