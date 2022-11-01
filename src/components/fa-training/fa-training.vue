<template>
  <div class="fa_training">
    <h3 class="fa_training_title">Training</h3>
    <h6 style="font-size:2.5rem;"><mark>temporarily not working</mark></h6>
    <canvas id="canvas">
    </canvas>
  </div>

</template>

<script>
/**@type {HTMLCanvasElement}*/

import { mapActions, mapGetters } from "vuex";
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
    };
  },
  mounted() {
    // this.startingWork();
  },
  computed: {
    ...mapGetters(["CANDLES"]),
  },
  methods: {
    ...mapActions(["GET_CANDLES_TO_CURRENCY_PAIR_FROM_API"]),
    canvasAlfa() {
      const canvas = document.querySelector("#canvas");
      this.ctx = canvas.getContext("2d");
      const width = (canvas.width = 400);
      const height = (canvas.height = 200);
      const middleY = height / 2;
      const candlesWidth = (width / this.numCandles - 2).toFixed(1);
      const range = this.middle - this.low;

      this.candlesShowTest(range, middleY, candlesWidth);
      this.drawMiddleLine(width, middleY);
    },
    candlesShowTest(range, middleY, candlesWidth) {
      this.candles.forEach((item, i) => {
        let curRange = Math.abs(this.middle - item[4]);
        let curInd = curRange / range;
        let heigth = middleY * curInd;
        let up = this.middle < item[4];
        let x = candlesWidth * i + i * 2;
        this.drawCandle(up, x, middleY, candlesWidth, heigth);
      });
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
    drawMiddleLine(width, y) {
      this.ctx.setLineDash([6, 3]);
      this.ctx.strokeStyle = "#ccc";
      this.ctx.lineWidth = 0.2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
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
      this.middle = Math.floor((this.low + this.high) / 2);
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