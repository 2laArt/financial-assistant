/**@type {HTMLCanvasElement}*/

export default class Scale {
	constructor(ctx, data, direction, length) {
		this.ctx = ctx;
		this.data = data;
		this.direction = direction;
		this.length = length;
		this.numOfSteps = 5;
		this.step = this.length / this.numOfSteps;
		this.scales = [];
		this.color = {
			white: "#fff",
		}
	}
	computedCoordinates(data) {
		const index = Math.floor(data.length / this.numOfSteps);
		for (let i = 1; i < this.numOfSteps; i++) {
			const currentData = data[index * i];
			const value = this.valueRelativeToDirection(currentData.tradingData);
			const position = this.positionRelativeToDirection(currentData)
			this.drawCoordinates(value, position)
		}
	}
	drawCoordination() {
		if (this.direction) {
			this.computedCoordinates(this.data)
		} else {
			const data = [...this.data].sort((a, b) => b.tradingData.close - a.tradingData.close)
			this.computedCoordinates(data)
		}
	}
	drawCoordinates(value, position) {
		// this.drawLine(position);
		this.ctx.beginPath();
		this.ctx.font = "10px serif";
		this.ctx.fillStyle = this.color.white;
		this.ctx.textAlign = "center";
		if (this.direction) {
			this.ctx.fillText(value, position, 12);
		} else {
			this.ctx.fillText(value, 20, position);
		}

	}
	drawLine(position) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.color.white;
		this.ctx.lineWidth = 1;
		this.ctx.moveTo(position, 0);
		this.ctx.lineTo(position, 10);
		this.ctx.stroke();
	}
	dateString(time) {
		const date = new Date(time);
		const hours = date.getHours() < 10 ?
			`0${date.getHours()}` :
			date.getHours()
		const minutes = date.getMinutes() < 10 ?
			`0${date.getMinutes()}` :
			date.getMinutes()
			;
		return `${hours}: ${minutes}`
	}
	valueRelativeToDirection(data) {
		return this.direction ? this.getTime(data) : this.getPrice(data)
	}
	positionRelativeToDirection(data) {
		return this.direction ? data.x : data.y
	}
	getPrice(data) {
		const str = String(data.close);
		return str.length > 5 ? str.slice(0, 5) : str
	}
	getTime(data) {
		return this.dateString(data.time)
	}
}