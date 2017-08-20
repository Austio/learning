function foo(x) {
	y++;
	z = x * y;
	console.log(x,y,z);
}

var y = 5, z;

function bar(x) {
	const oldy = y;
	const oldz = z;
	foo(x);
	y = oldy;
	z = oldz;
}

console.log(y,z, 'before');
bar(20);
console.log(y,z, 'between');
bar(25);
console.log(y,z, 'after');
