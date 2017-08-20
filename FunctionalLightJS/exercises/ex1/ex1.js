function bar(x, y) {
	var z;

	foo(x);
	return [y, z];

  function foo(x) {
    y++;
    z = x * y;
    console.log(x,y,z);
  }
}

bar(20, 5);
bar(25, 6);
