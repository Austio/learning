function lotteryNum() {
	return (Math.round(Math.random() * 100) % 58) + 1;
}

function pickNumber(){}

var luckyLotteryNumbers = [];

for (var i = 0; i < 6; i++) {
	pickNumber();
}

console.log(luckyLotteryNumbers);
