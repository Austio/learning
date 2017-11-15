function lotteryNum() {
	return (Math.round(Math.random() * 100) % 58) + 1;
}

function pick(n, l = []) {
  Object.freeze(l);
	if (n === 0) {
  	return l;
	}


	const num = lotteryNum();
  if (l.indexOf(num) > -1) {
  	return pick(n, l);
	}

	const newList = [...l, num].sort((l, r) => Number(l) > Number(r));
	return pick(n - 1, newList);
}


console.log(pick(9));
