function lotteryNum() {
	return (Math.round(Math.random() * 100) % 58) + 1;
}

function pickNumber(){
	const length = luckyLotteryNumbers.length;

	while (luckyLotteryNumbers.length === length) {
		let num = lotteryNum();

		if (luckyLotteryNumbers.indexOf(num) === -1) {
      luckyLotteryNumbers = [...luckyLotteryNumbers, num].sort();
    }
	}
}

var luckyLotteryNumbers = [];

for (var i = 0; i < 6; i++) {
	pickNumber();
}

console.log(luckyLotteryNumbers);
