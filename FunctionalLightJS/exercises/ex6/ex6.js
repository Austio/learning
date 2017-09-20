function mult(...args) {
  if (args.length < 1) {
    return 1;
  }
	else if (args.length === 1) {
	  return args[0];
  } else {
	  return args[0] * mult(...args.splice(1))
  }
}

console.log(mult(3))
console.log(mult(3,4))
console.log(mult(3,4,5));	// 60

console.log(mult(3,4,5,6));	// Oops!
