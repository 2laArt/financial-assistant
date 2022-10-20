/**@type {HTMLCanvasElement}*/

export default class Scale {
	constructor(ctx, direction, length, start, end) {
		this.ctx = ctx;
		this.direction = direction;
		this.length = length;
		this.start = start;
		this.end = end;
		this.numOfSteps = 5;
		this.step = this.length / this.numOfSteps;
		this.scales = [];
	}
	computedCoordinatesValue() {
		const difference = this.end - this.start;
		const stepValue = difference / this.numOfSteps;
		for (let i = 1; i < this.numOfSteps; i++) {
			const value = this.start + (stepValue * i)
			this.scales.push(this.dateString(value))
		}
		console.log(this.scales)
	}
	computedCoordinatesPosition() {
		this.computedCoordinatesValue();
		for (let i = 1; i < this.numOfSteps; i++) {
			const position = this.step * i;
			this.drawCoordinates(this.scales[i - 1], position)
		}
	}
	drawCoordinates(value, position) {
		this.ctx.beginPath();
		this.ctx.font = "10px serif";
		this.ctx.fillStyle = "#ccc";
		this.ctx.textAlign = "center";
		this.ctx.arc(position, 0, 3, 0, 2 * Math.PI);
		this.ctx.fillText(value, position, 10);
		this.ctx.fill();
	}
	dateString(time) {
		const date = new Date(time * 1000);
		const hours = date.getHours() < 10 ?
			`0${date.getHours()}` :
			date.getHours()
		const minutes = date.getMinutes() < 10 ?
			`0${date.getMinutes()}` :
			date.getMinutes()
			;
		return `${hours}: ${minutes}`
	}
}