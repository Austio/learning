function foo(x,y) { return function() { return x + y }}

var x = foo(3,4);

console.log(x());	// 7
console.log(x());	// 7

// Interesting thoughts from Kyle

// Work upfront, still pure
function upfrontFoo(x,y) {
  var sum = x + y;
  return function() { return sum }
}
var x = upfrontFoo(3,4);

console.log(x());	// 7
console.log(x());	// 7

// Work lazy, still pure
function lazyFoo(x,y) {
  var sum;
  return function() {
    sum = sum || (x + y)
    return sum;
  }
}

var x = lazyFoo(3,4);

console.log(x());	// 7
console.log(x());	// 7

