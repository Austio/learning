function increment(x) { return x + 1; }
function decrement(x) { return x - 1; }
function double(x) { return x * 2; }
function half(x) { return x / 2; }

function compose() {}
function pipe() {}

var f = compose(decrement,double,increment,half);
var p = pipe(half,increment,double,decrement);

f(3) === 4;
// true

f(3) === p(3);
// true
