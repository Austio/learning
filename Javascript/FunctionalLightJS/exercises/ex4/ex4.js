function lotteryNum() {
	return (Math.round(Math.random() * 100) % 58) + 1;
}

function pick(n, l = []) {
	if (n === 0) {
  	return l;
	}

	const num = lotteryNum();
  if (l.indexOf(num) > -1) {
  	return pick(n, l);
	}

	console.warn(num)
	console.log(l)
	const newList = [...l, num].sort((l, r) => l - r);
	return pick(n - 1, Object.freeze(newList));
}


console.log(pick(11));
