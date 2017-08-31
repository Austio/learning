function increment(x) { return x + 1; }
function decrement(x) { return x - 1; }
function double(x) { return x * 2; }
function half(x) { return x / 2; }

const slice = Array.prototype.slice;

function pipe() {
  const args = slice.call(arguments);

  return arg => args.reduce((acc, curr) => curr(acc), arg);
}

const reverse = Array.prototype.reverse;
function compose() {
  const args = slice.call(arguments);
  const reversedArgs = args.reverse();

  return pipe.apply(reversedArgs);
}

var c = compose(decrement,double,increment,half);
var p = pipe(half,increment,double,decrement);
