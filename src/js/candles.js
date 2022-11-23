/**@type {HTMLCanvasElement}*/

class Candles {
	constructor(ctx, candles, width, height, amountDots, highPrice, middlePrice, lowPrice) {
		this.ctx = ctx;
		this.candles = candles;
		this.width = width;
		this.height = height;
		this.middleOfChart = height / 2;
		this.amountDots = amountDots;
		this.highPrice = highPrice;
		this.middlePrice = middlePrice;
		this.lowPrice = lowPrice;
		this.priceRange = this.highPrice - this.lowPrice;
		this.candleWidth = 10;
		this.allCandlesData = [];
	}
	startWork() {
		this.candles.forEach((item, i) => {
			const [low, high, open, close] = this.coordsItem(item); //coords
			const isUp = open > close;
			const color = isUp ? '#115A11' : '#794444';
			const candleHeight = Math.abs(open - close);
			const x = Math.floor(i * this.amountDots);
			const y = isUp ? close : open;
			this.drawCandleMiddleLine(
				x + this.candleWidth / 2,
				low,
				high
			);
			this.drawRect(x, y, candleHeight, color);
			this.pushInAllCandlesData(x, low, x + this.candleWidth, high, item);
		});
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
		this.ctx.lineWidth = 0.3;
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
		const coord = persent * this.height;
		return Math.floor(coord);
	}
}
export default Candles