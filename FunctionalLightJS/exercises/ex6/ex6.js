function mult(...args) {
  if (args.length < 1) {
    return 1;
  }

  if (args.length === 1) {
	  return args[0];
  } else {
	  return args[0] * mult(...args.splice(1))
  }
}
//
// console.log(mult(3))
// console.log(mult(3,4))
// console.log(mult(3,4,5));	// 60
//
// console.log(mult(3,4,5,6));	// Oops!

// With Kyle Idea Kyle

function mul(product, ...nums) {
  if (nums.length === 0) {
    return product || 1;
  }

  return mul(...nums) * product
}
console.log('3', mul(3))
console.log('12', mul(3,4))
console.log('60', mul(3,4,5));	// 60
console.log('360', mul(3,4,5,6));	// Oops!
