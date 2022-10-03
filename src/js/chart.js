/**@type {HTMLCanvasElement}*/

export default class Chart {
	constructor(ctx, width, height, amount, range, middlePrice, candles) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.amount = amount;
		this.candles = candles;
		this.range = range;
		this.middleOfChart = this.height / 2;
		this.middlePrice = middlePrice;
		this.colorRoot = "#181822";
		this.colorGray = "#ccc";
		this.colorGreen = "#07a663";
		this.colorRed = "#c90842";
		this.priceList = [];
	}
	drawDashedLine(coord1, coord2, coord3, color) {
		this.ctx.beginPath();
		this.ctx.setLineDash([6, 3]);
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 0.2;
		this.ctx.moveTo(coord1.x, coord1.y);
		this.ctx.lineTo(coord2.x, coord2.y);
		this.ctx.lineTo(coord3.x, coord3.y);
		this.ctx.stroke();
	}
	drawHorizonLine(x, y) {
		let coord = [
			{ x: 0, y: y },
			{ x: x, y: y },
			{ x: this.width, y: y },
		];
		this.drawDashedLine(...coord, "#ccc");
	}
	drawVerticalLine(x, y) {
		let coord = [
			{ x: x, y: 0 },
			{ x: x, y: y },
			{ x: x, y: this.height },
		];
		this.drawDashedLine(...coord, "#ccc");
	}
	upDateCanvas() {
		this.ctx.fillStyle = this.colorRoot;
		this.ctx.beginPath();
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.stroke();
	}
	drawChartLine(curDot, x, y, color) {
		this.ctx.beginPath();
		this.ctx.setLineDash([])
		this.ctx.moveTo(curDot.x, curDot.y);
		this.ctx.lineTo(x, y);
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = color;
		this.ctx.fillStyle = this.colorGray;
		this.ctx.fill();
		this.ctx.stroke();
	}
	noName(x) {
		try {
			return this.priceList.find(item => item[0] >= x)[1]
		} catch (e) {
			console.log(e)
		}
	}
	drawChart() {
		let curDot = { x: 0, y: this.middleOfChart };
		this.candles.forEach((item, i) => {
			let priceClose = item[4];
			let curRange = Math.abs(this.middlePrice - priceClose);
			let curInd = curRange / this.range;
			let heigthLine = this.middleOfChart * curInd;
			let up = this.middlePrice < priceClose;
			let x = (i * this.amount).toFixed(1);
			let y = up ? this.middleOfChart - heigthLine : this.middleOfChart + heigthLine;
			let color = y < this.middleOfChart ? this.colorGreen : this.colorRed;
			if (curDot.y > this.middleOfChart && y < this.middleOfChart) {
				let x1 = (i * this.amount) - (this.amount / 2);
				let y1 = this.middleOfChart;
				this.drawChartLine(curDot, x1, y1, this.colorRed);
				curDot.x = x1;
				curDot.y = y1;
				this.drawChartLine(curDot, x, y, this.colorGreen);
			} else if (curDot.y < this.middleOfChart && y > this.middleOfChart) {
				let x1 = (i * this.amount) - (this.amount / 2);
				let y1 = this.middleOfChart;
				this.drawChartLine(curDot, x1, y1, this.colorGreen);
				curDot.x = x1;
				curDot.y = y1;
				this.drawChartLine(curDot, x, y, this.colorRed);
			} else {
				this.drawChartLine(curDot, x, y, color);
			}
			curDot.x = x;
			curDot.y = y;
			this.priceList.push([+x, priceClose]);
		});
	}
}