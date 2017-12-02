const assert = (fx, name) => fx() ? console.log(`${name} works`) : console.log(`${name} broken`);

function one() { return 1; }
function two() { return 2; }
function add(a,b) { return a + b; }
function add2(fa,fb) { return add(fa(), fb()); }
assert(() => add2(one, two) === 3, 'add2')

function addnRecursive(fxa = []) {
  if (fxa.length >= 2) {
    return add2(fxa[0], fxa[1]) + addnRecursive(fxa.slice(2))
  }

  if (fxa.length === 1) {
    return add2(() => 0, fxa[0]);
  }

  return 0;
}

assert(() => addnRecursive([one, two, () => 3, () => 4]) === 10, 'addnRecursive')

function addnLoop(fxa = []) {
  let sum = 0;

  const zero = () => 0;
  for (let i = 0; i < fxa.length; i = i + 2) {
    const fa = fxa[i] || zero;
    const fb = fxa[i + 1] || zero;
    sum = sum + add2(fa, fb);
  }

  return sum;
}

assert(() => addnLoop([one, two, () => 3, () => 4]) === 10, 'addnLoop')

function addnInternal(fxa = []) {
  const groupedInTwos = fxa.reduce((acc, curr) => {
    if (acc[0].length < 2) {
      acc[0].push(curr);
    } else {
      acc.unshift([curr])
    }

    return acc;
  }, [[]]);


  return groupedInTwos.reduce((acc, curr) => {
    const val = (curr.length === 2)
      ? add2(curr[0], curr[1])
      : 0;

    return val + acc;
  }, 0)
}

assert(() => addnInternal([one, two, () => 3, () => 4]) === 10, 'addnInternal')

function filterArr (fxn) {
  function recur(arr = [], uniq = []) {
    if (arr.length === 0) {
      return uniq;
    }

    if (fxn(uniq, arr[0])) {
      uniq.push(arr[0]);
    }

    return recur(arr.slice(1), uniq);
  }

  return recur;
}

const findUniq = filterArr((arr, elm) => arr.indexOf(elm) === -1);
assert(() => findUniq([1,1,2,3,3,3,3,2,2,1, 2]).length === 3, 'findUniq')


const onlyEven = filterArr((arr, elm) => elm % 2 === 0);
assert(() => onlyEven([1,1,2,3,3,3,3,2,2,1,2]).length === 4, 'onlyEven')

// Kyle Solutions
function constant(v) {
  return function() {
    return v;
  }
}

const vals = [1,2,3,4,5].map(v => constant(v))

function kyleIterativeAddn(fns) {
  fns = fns.slice();

  while (fns.length > 2) {
    let [fn0, fn1, ...rest] = fns;
    fns = [
      constant(add2(fn0, fn1)),
      ...rest
    ];
  }
  return add2( fns[0], fns[1] )
}

assert(() => kyleIterativeAddn(vals) === 15, 'kylesIterativeAddn')
/* Call  Stack looks like
fns = [1,2,3,4,5]
  fn0 = 1
  fn1 = 2
  rest = [3,4,5]
  fns = [ constant(add2(1,2)), 3, 4, 5]
    fn0 = constant(add2(1,2))
    fn1 = 3
    rest = [4,5]
    fns = [ constant(add2( constant(add2(1,2))) , 3}
      , 4, 5]
*/

function kylesRecursiveAddn([fn0, fn1, ...fns]) {
  if (fns.length > 0) {
    return kylesRecursiveAddn([
      function(){ return (add2(fn0, fn1)) },
      ...fns
    ])
  }

  return add2(fn0, fn1);
}

assert(() => kylesRecursiveAddn(vals) === 15, 'kylesRecursiveAddn')

// This is really nice!
function kylesReductiveAddn(fns) {
  return fns.reduce(function reduceExternal(acc, curr) {
    return function internal() {
      return add2(acc, curr);
    }
  })()
}
// acc 1(), curr 2()
// return function() { return add2(1(), 2()) }
/// acc function internalA() { return add2(1(), 2()) }
/// curr 3()
//// acc function internalB() { return add2(internalA, 3()) }
//// curr 4()
//// acc function internalC() { return add2(internalB, 4()) }
//// curr 5()
//// acc function internalD() { return add2(internalc, 4()) }

// internalD() return add2(internalc => internalb => internala => 1, 2, => b 3 => d 4, 5)

assert(() => kylesReductiveAddn(vals) === 15, 'kylesReductiveAddn')
