/**@type {HTMLCanvasElement}*/

export default class Scale {
	constructor(ctx, data, axis, length, numOfSteps, param) {
		this.ctx = ctx;
		this.data = data;
		this.axis = axis;
		this.length = length;
		this.numOfSteps = numOfSteps;
		this.param = param;
		this.step = this.length / this.numOfSteps;
		this.color = {
			white: "#fff",
		};
	}
	drawTime() {
		for (let i = 1; i < this.numOfSteps; i++) {
			const currentData = this.data.find(item => item[this.axis] >= this.step * i)
			// debugger;
			const value = this.parameterValue(currentData.tradingData[this.param]);
			const position = this.positionRelativeToDirection(currentData)
			this.drawCoordinates(value, position)
		}
	}
	drawPriceScales() {
		const pixelOfPrice = this.pixelOfPrice();
		for (let i = 1; i < this.numOfSteps; i++) {
			const coordinate = this.step * i;
			const nearestElem = [...this.data]
				.sort((a, b) =>
					Math.abs(coordinate - a[this.axis]) -
					Math.abs(coordinate - b[this.axis]))[0];

			const isAbove = coordinate > nearestElem[this.axis];
			const distanceOfDot = Math.abs(coordinate - nearestElem[this.axis]);
			const priceAddition = pixelOfPrice * distanceOfDot;
			const currentValue = Number(nearestElem.tradingData[this.param]);
			let price;
			if (isAbove) {
				price = this.getPrice(currentValue - priceAddition);
			} else price = this.getPrice(currentValue + priceAddition);
			this.drawCoordinates(price, coordinate);
		}
	}
	pixelOfPrice() {
		const dataSortPrice = [...this.data].sort((a, b) =>
			a.tradingData[this.param] - b.tradingData[this.param]);
		const dataSortAxis = [...this.data].sort((a, b) =>
			a[this.axis] - b[this.axis]);
		const rangePrice = dataSortPrice[dataSortPrice.length - 1].tradingData[this.param] - dataSortPrice[0].tradingData[this.param];
		const axisLength = dataSortAxis[dataSortAxis.length - 1][this.axis] - dataSortAxis[0][this.axis];
		return rangePrice / axisLength;
	}

	drawCoordinates(value, position) {
		// this.drawLine(position);
		this.ctx.beginPath();
		this.ctx.font = `${10}px serif`;
		this.ctx.fillStyle = this.color.white;

		if (this.axis === "x") {
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "hanging"
			this.ctx.fillText(value, position, 2);
		} else {
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "middle"
			this.ctx.fillText(value, 2, position);
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
		if (data > 1) return data.toFixed(2)
		return data
	}
	getTime(data) {
		return this.dateString(data)
	}
}