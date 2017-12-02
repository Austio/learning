// Splits array and sends each element as an argument parameter
function applyArgs(fn) {
  return function(arrayArg) {
    return fn(...arrayArg);
  }
}

function foo(a,b,c,d) {
  return a + b + c + d;
}

console.log(applyArgs(foo)([1,2,3,4]));

function unapplyArgs(fn) {
  return function(...args) {
    return fn(args);
  }
}

const sum = arr => arr.reduce((acc, curr) => curr + acc, 0);

console.log(unapplyArgs(sum)(1,2,3,4));