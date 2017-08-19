function foo(x) {
	y++;
	z = x * y;
}

var y = 5, z;

function bar(x) {
	foo(x)
}

bar(20);
console.log(z);		// 120

bar(25);
console.log(z);		// 175
