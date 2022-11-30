/**@type {HTMLCanvasElement}*/

class Candles {
	constructor(ctx, candles, width, height) {
		this.ctx = ctx;
		this.candles = candles;
		this.width = width;
		this.height = height;
		this.amountDots = (this.width / this.candles.length).toFixed(1);
		this.lowPrice = 0;
		this.highPrice = 1;
		this.priceRange = 1;
		this.candleWidth = 10;
		this.allCandlesData = [];
		this.color = {
			green: "#07a663",
			gray: "#ccc",
			root: "#181822",
			red: "#c90842",
		}
	}
	startWork() {
		this.getPriceRange();
		this.candles.forEach((item, i) => {
			const [low, high, open, close] = this.coordsItem(item); //coords
			const isDown = open < close;
			const color = isDown ? '#9c2d2d' : '#2da850';
			const candleHeight = Math.abs(open - close);
			const x = Math.floor(i * this.amountDots);
			const y = isDown ? open : close;
			this.drawCandleMiddleLine(
				x + this.candleWidth / 2,
				low,
				high
			);
			this.drawRect(x, y, candleHeight, color);
			this.pushInAllCandlesData(x, high, x + this.candleWidth, low, item);
		});
	}
	updateCanvas() {
		this.ctx.fillStyle = this.color.root;
		this.ctx.beginPath();
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.stroke();
	}
	pushInAllCandlesData(x1, y1, x2, y2, data) {
		const candle = {
			coords: { x1, y1, x2, y2 },
			data: data
		};
		this.allCandlesData.push(candle);
	}
	drawLine(coords) {
		this.ctx.beginPath();
		this.ctx.setLineDash([]);
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = "#DCDCDC";
		this.ctx.moveTo(coords.x1, coords.y1);
		this.ctx.lineTo(coords.x2, coords.y2);
		this.ctx.stroke();
		//!!!
	}
	drawCandleMiddleLine(x, y1, y2) {
		// #DCDCDC
		this.ctx.beginPath();
		this.ctx.setLineDash([3, 2]);
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = '#DCDCDC';
		this.ctx.moveTo(x, y1);
		this.ctx.lineTo(x, y2);
		this.ctx.stroke();
	}
	drawRect(x, y, candleHeight, color) {
		const height = candleHeight < 1 ? 1 : candleHeight;//????/
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, this.candleWidth, height)
		this.ctx.fill();
	}
	coordsItem(candle) {
		//time low high open close vol
		// start-end prices from arr candles
		const first = 1;
		const last = 5;
		return candle
			.slice(first, last)
			.map(item => this.getCoordsOfPrice(item));
	}
	getCoordsOfPrice(price) {
		// ratio of coordinates to price 
		const curRange = price - this.lowPrice;
		const persent = curRange / this.priceRange;
		const coord = this.height - (persent * this.height);
		return Math.floor(coord);
	}
	getPriceRange() {
		const sortArr = (cb) => [...this.candles].sort((a, b) => cb(a, b))[0];
		this.lowPrice = sortArr((a, b) => a[1] - b[1])[1];
		this.highPrice = sortArr((a, b) => b[2] - a[2])[2];
		this.priceRange = this.highPrice - this.lowPrice;
		// console.log(this.lowPrice)
	}

}
export default Candles