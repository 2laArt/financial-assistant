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
		this.color = {
			green: "#07a663",
			gray: "#ccc",
			root: "#181822",
			red: "#c90842",
		}
		this.chartPartsData = [];
	}

	drawDashedLine(coord1, coord2, coord3, color) {
		this.ctx.beginPath();
		this.ctx.setLineDash([3, 2]);
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
	updateCanvas() {
		this.ctx.fillStyle = this.color.root;
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
		this.ctx.fillStyle = this.color.gray;
		this.ctx.fill();
		this.ctx.stroke();
	}
	selectedData(x) {
		// refactoring !!!
		// console.log(this.chartPartsData)
		try {
			return this.chartPartsData.find((item) => item.x >= x)
			// && i < this.chartPartsData.length - 1
		} catch (e) {
			console.log(e)
			return null
		}
	}
	drawCircle(x, y, radius, color) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}
	addChartPartData(x, y, color, tradingData) {
		if (tradingData.length < 5) return
		this.chartPartsData.push({
			x: +x,
			y: y,
			color: color,
			tradingData: {
				time: (tradingData[0] * 1000),
				low: tradingData[1],
				high: tradingData[2],
				open: tradingData[3],
				close: tradingData[4],
				vol: tradingData[5]
			}
		})
	}
	drawChart() {
		let curDot = { x: undefined, y: undefined };
		this.candles.forEach((item, i) => {
			let priceCloseIndex = 4;
			let priceClose = item[priceCloseIndex];
			let curRange = Math.abs(this.middlePrice - priceClose);
			let curInd = curRange / this.range;
			let heigthLine = this.middleOfChart * curInd;
			let up = this.middlePrice < priceClose;
			let x = i * this.amount;
			let y = up ? this.middleOfChart - heigthLine : this.middleOfChart + heigthLine;
			let color = y < this.middleOfChart ? this.color.green : this.color.red;
			if (curDot.y > this.middleOfChart && y < this.middleOfChart) {
				let x1 = (i * this.amount) - (this.amount / 2);
				let y1 = this.middleOfChart;
				this.drawChartLine(curDot, x1, y1, this.color.red);
				curDot.x = x1;
				curDot.y = y1;
				this.drawChartLine(curDot, x, y, this.color.green);
			} else if (curDot.y < this.middleOfChart && y > this.middleOfChart) {
				let x1 = (i * this.amount) - (this.amount / 2);
				let y1 = this.middleOfChart;
				this.drawChartLine(curDot, x1, y1, this.color.green);
				curDot.x = x1;
				curDot.y = y1;
				this.drawChartLine(curDot, x, y, this.color.red);
			} else {
				this.drawChartLine(curDot, x, y, color);
			}
			curDot.x = x;
			curDot.y = y;
			this.addChartPartData(x, y, color, item)

		});
	}
}