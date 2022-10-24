/**@type {HTMLCanvasElement}*/

export default class Scale {
	constructor(ctx, data, axis, length, numOfSteps, param) {
		this.ctx = ctx;
		this.data = data;
		this.axis = axis;
		this.length = length;
		this.numOfSteps = numOfSteps;
		this.param = param;
		this.color = {
			white: "#fff",
		};
		this.step = this.length / this.numOfSteps;
	}
	drawTime() {
		for (let i = 1; i < this.numOfSteps; i++) {
			const currentData = this.data.find(item => item[this.axis] >= this.step * i)
			const value = this.parameterValue(currentData.tradingData[this.param]);
			const position = this.positionRelativeToDirection(currentData)
			this.drawCoordinates(value, position)
		}
	}
	newDrawing() {
		for (let i = 1; i < this.numOfSteps; i++) {
			const coordinate = this.step * i;
			const nearestElem = [...this.data]
				.sort((a, b) =>
					Math.abs(coordinate - a[this.axis]) -
					Math.abs(coordinate - b[this.axis]))[0];

			const boolean = coordinate > nearestElem[this.axis];
			const plus = this.percentageOfValue(nearestElem, boolean, coordinate);
			plus
			const val = nearestElem.tradingData[this.param];
			const value = this.parameterValue(val);
			this.drawCoordinates(value, coordinate);
		}
	}
	percentageOfValue(elem, boolean, coordinate) {
		const [first, second] = [...this.searchPair(elem, boolean)]
		const distanceBetweenElem =
			Math.abs(first[this.axis] - second[this.axis]);

		const paramRange =
			Math.abs(first.tradingData[this.param] - second.tradingData[this.param]);

		const distanceToCoordination =
			Math.abs(first[this.axis] - coordinate);

		const percentages = distanceToCoordination / distanceBetweenElem;

		const plus = paramRange * percentages;
		return plus;
	}
	searchPair(elem, boolean) {
		const index = this.data.indexOf(elem);
		const nextIndex = boolean ? index + 1 : index - 1;
		const first = this.data[index]
		const second = this.data[nextIndex]
		return [first, second]
	}

	drawCoordinates(value, position) {
		// this.drawLine(position);
		this.ctx.beginPath();
		this.ctx.font = "10px serif";
		this.ctx.fillStyle = this.color.white;

		if (this.axis === "x") {
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "bottom"
			this.ctx.fillText(value, position, 12);
		} else {
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "middle"
			this.ctx.fillText(value, 0, position);
		}

	}
	drawLine(position) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.color.white;
		this.ctx.lineWidth = 1;
		this.ctx.moveTo(position, 0);
		this.ctx.lineTo(position, 0);
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
	parameterValue(data) {
		if (this.param === "time") {
			return this.getTime(data)
		} else return this.getPrice(data)
	}
	positionRelativeToDirection(data) {
		return data[this.axis]
	}
	getPrice(data) {
		// const str = String(data);
		// return str.length > 5 ? str.slice(0, 5) : str;
		return data.toPrecision(4)
	}
	getTime(data) {
		return this.dateString(data)
	}
}