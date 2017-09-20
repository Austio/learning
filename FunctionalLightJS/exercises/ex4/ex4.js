function lotteryNum() {
	return (Math.round(Math.random() * 100) % 58) + 1;
}

function pickNumber(n){
	const length = n.length;

	while (n.length === length) {
		let num = lotteryNum();

		if (luckyLotteryNumbers.indexOf(num) === -1) {
      return [...luckyLotteryNumbers, num].sort();
    }
	}
}

var luckyLotteryNumbers = [];

for (var i = 0; i < 6; i++) {
	luckyLotteryNumbers = pickNumber(luckyLotteryNumbers);
}

console.log(luckyLotteryNumbers);
