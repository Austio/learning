function output(txt) {
	console.log(txt);
}

function printIf(predicate) {
	return function(msg) {
		if (predicate(msg)) {
			output(msg);
		}
	};
}

function isShortEnough(str) {
	return str.length <= 5;
}

function isLongEnough(str) {
	return !isShortEnough(str);
}

var msg1 = "Hello";
var msg2 = msg1 + " World";

printIf(isShortEnough)(msg1);		// Hello
printIf(isShortEnough)(msg2);
printIf(isLongEnough)(msg1);
printIf(isLongEnough)(msg2);		// Hello World
