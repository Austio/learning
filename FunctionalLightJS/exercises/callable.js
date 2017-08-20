// Splits array and sends each element as an argument parameter
function callArgs(fn) {
  return function(arrayArg) {
    return fn(...arrayArg);
  }
}

function foo(a,b,c,d) {
  return a + b + c + d;
}

console.log(callArgs(foo)([1,2,3,4]));