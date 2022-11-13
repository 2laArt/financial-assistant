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
	}
	startWork() {
		const xStart = 20;
		this.candles.forEach((item, i) => {
			const [low, high, open, close] = this.coordsYitem(item);
			const isUp = open > close
			const color = isUp ? '#115A11' : '#794444';
			const candleHeight = Math.abs(open - close)
			const x = i * this.amountDots + (i * 5) + xStart;
			const y = isUp ? close : open;
			this.drawCandleMiddleLine(
				x + this.candleWidth / 2,
				low,
				high
			)
			this.drawCandle(x, y, candleHeight, color);
			// 794444 red
			// 115A11 green
		});
	}
	drawCandleMiddleLine(x, y1, y2) {
		// #DCDCDC
		this.ctx.beginPath();
		this.ctx.setLineDash([3, 2]);
		this.ctx.strokeStyle = '#DCDCDC';
		this.ctx.lineWidth = 0.3;
		this.ctx.moveTo(x, y1);
		this.ctx.lineTo(x, y2);
		this.ctx.stroke();
	}
	drawCandle(x, y, candleHeight, color) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, this.candleWidth, candleHeight)
		this.ctx.fill();
	}
	coordsYitem(candle) {
		const a = 1; //rename
		const b = 6;
		return candle
			.slice(a, b)
			.map(item => {
				const curRange = item - this.lowPrice;
				const persent = curRange / this.priceRange;
				const coord = persent * this.height;
				return coord;
			});
	}
}
//time low high open close vol
export default Candles