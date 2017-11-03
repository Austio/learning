function when(output) {
	return function(predicate) {
	  return function(...arg) {
	    if(predicate(...arg)) {
	      output(...arg);
      }
    }
  }
}

function output(txt) {
	console.log(txt);
}

const printIf = when(output)

function not(fn) {
	return function negate(...args) {
		return !fn(...args);
	}
};

function isShortEnough(str) {
	return str.length <= 5;
}

var isLongEnough = not(isShortEnough)

var msg1 = "Hello";
var msg2 = msg1 + " World";

printIf(isShortEnough)(msg1);		// Hello
printIf(isShortEnough)(msg2);
printIf(isLongEnough)(msg1);
printIf(isLongEnough)(msg2);		// Hello World
