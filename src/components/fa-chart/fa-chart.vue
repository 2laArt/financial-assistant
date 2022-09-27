<template>
  <div class="fa_chart">
    <h3 class="fa_training_title">Chart</h3>
    <div class="cord_mouse">
      {{`x: ${mouse.x} - y: ${mouse.y}`}}
    </div>
    <canvas
      id="canvasChart"
      @mousemove="moveMouseOnCanvas($event)"
    >
    </canvas>
  </div>
</template>

<script>
/**@type {HTMLCanvasElement}*/

import { mapActions, mapGetters } from "vuex";
// ALCX COMP XCN
export default {
  name: "fa-training",
  data() {
    return {
      curpair: "BTC-USD",
      candles: [],
      numCandles: 0,
      ctx: null,
      middle: 1,
      low: 0,
      high: 2,
      mouse: {
        x: 0,
        y: 0,
      },
    };
  },
  mounted() {
    this.startingWork();
  },
  computed: {
    ...mapGetters(["CANDLES"]),
  },
  methods: {
    ...mapActions(["GET_CANDLES_TO_CURRENCY_PAIR_FROM_API"]),
    canvasAlfa() {
      const canvas = document.querySelector("#canvasChart");
      this.ctx = canvas.getContext("2d");
      const width = (canvas.width = 400);
      const height = (canvas.height = 200);
      const middleY = height / 2;
      const candlesWidth = (width / this.numCandles).toFixed(1);
      const range = this.middle - this.low;

      this.upDateCanvas(width, height);

      this.drawChart(range, middleY, candlesWidth);
      this.drawHorizonLine(width);
      this.drawVerticalLine(height);
      this.drawMiddleLine(width, middleY);

      requestAnimationFrame(this.canvasAlfa);
    },
    drawChart(range, middleY, candlesWidth) {
      let curDot = { x: 0, y: middleY };
      this.candles.forEach((item, i) => {
        let curRange = Math.abs(this.middle - item[4]);
        let curInd = curRange / range;
        let heigth = middleY * curInd;
        let up = this.middle < item[4];
        let x = i * candlesWidth;
        let y = up ? middleY - heigth : middleY + heigth;
        let color = y < middleY ? "green" : "red";
        if (curDot.y > middleY && y < middleY) {
          let x1 = i * candlesWidth - candlesWidth / 2;
          let y1 = middleY;
          this.drawChartLine(curDot, x1, y1, "red");
          curDot.x = x1;
          curDot.y = y1;
          this.drawChartLine(curDot, x, y, "green");
        } else if (curDot.y < middleY && y > middleY) {
          let x1 = i * candlesWidth - candlesWidth / 2;
          let y1 = middleY;
          this.drawChartLine(curDot, x1, y1, "green");
          curDot.x = x1;
          curDot.y = y1;
          this.drawChartLine(curDot, x, y, "red");
        } else {
          this.drawChartLine(curDot, x, y, color);
        }
        curDot.x = x;
        curDot.y = y;
      });
    },
    drawChartLine(curDot, x, y, color) {
      this.ctx.beginPath();
      this.ctx.moveTo(curDot.x, curDot.y);

      this.ctx.lineTo(x, y);

      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    },
    drawCandle(up, x, y, width, height) {
      if (up) {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(x, y, width, -height);
        return;
      }
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(x, y, width, height);
    },
    upDateCanvas(width, height) {
      this.ctx.fillStyle = "#181822";
      this.ctx.beginPath();
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.stroke();
    },
    drawDashedLine(coord1, coord2, coord3, color) {
      this.ctx.setLineDash([6, 3]);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 0.2;
      this.ctx.beginPath();
      this.ctx.moveTo(coord1.x, coord1.y);
      this.ctx.lineTo(coord2.x, coord2.y);
      this.ctx.lineTo(coord3.x, coord3.y);
      this.ctx.stroke();
    },
    drawMiddleLine(width, middleY) {
      let coord1 = { x: 0, y: middleY };
      let coord2 = { x: width / 2, y: middleY };
      let coord3 = { x: width, y: middleY };
      this.drawDashedLine(coord1, coord2, coord3, "rgb(153,153,153)");
    },
    drawHorizonLine(width) {
      let x = this.mouse.x;
      let y = this.mouse.y;
      let horizon = [
        { x: 0, y: y },
        { x: x, y: y },
        { x: width, y: y },
      ];
      this.drawDashedLine(...horizon, "#ccc");
    },
    drawVerticalLine(height) {
      let x = this.mouse.x;
      let y = this.mouse.y;
      let horizon = [
        { x: x, y: 0 },
        { x: x, y: y },
        { x: x, y: height },
      ];
      this.drawDashedLine(...horizon, "#ccc");
    },
    moveMouseOnCanvas(event) {
      this.mouse.x = event.offsetX;
      this.mouse.y = event.offsetY;
    },
    createDateString(date) {
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:00`;
    },
    getAverageCost() {
      const sortArr = (cb) => this.candles.sort((a, b) => cb(a, b))[0];
      const lowArr = sortArr((a, b) => a[1] - b[1]) ?? [1, 2, 3];
      const highArr = sortArr((a, b) => b[2] - a[2]) ?? [1, 2, 3];
      this.low = lowArr[1];
      this.high = highArr[2];
      this.middle = (this.low + this.high) / 2;
      // console.log(this.low, this.high);
      // console.log(this.middle);
    },
    async startingWork() {
      const pair = this.curpair;
      const dateNow = new Date(Date.now());
      const datePast = new Date(Date.now() - 36e5 * 4);
      const dateStart = this.createDateString(datePast);
      const dateEnd = this.createDateString(dateNow);
      await this.GET_CANDLES_TO_CURRENCY_PAIR_FROM_API({
        pair,
        dateStart,
        dateEnd,
      });
      this.candles = this.CANDLES;
      this.numCandles = this.candles.length;
      this.getAverageCost();

      this.canvasAlfa();
    },
  },
};
</script>