<template>
  <div class="fa_training">
    <h3 class="fa_training_title">Training</h3>
    <div class="canldes_box">
      <canvas
        id="canvas"
        @mousemove="moveMouseOnCanvas($event)"
        @mouseover="candlesHover = true"
        @mouseout="candlesHover = false"
        :class="{
          'cursor_hover': infoCandles.data
        }"
      />
      <div
        class="info_candles"
        v-if="infoCandles.data"
        :style="{
          'top': `${infoCandles.coords.y1}px`,
          'left':isInfoPosition?
          `${infoCandles.coords.x2+10}px`:
          `${infoCandles.coords.x1-80}px`,
          }"
      >
        <div
          v-for="item in infoCandles.data"
          :key="item"
        >
          {{item}}
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Candles from "../../js/candles/candles";
import lastCandleSocket from "../../js/candles/last-candle-socket";
export default {
  name: "fa-training",
  data() {
    return {
      curpair: "BTC-USD",
      candlesData: [],
      allCandlesData: null,
      candlesCanvasSize: { width: 400, height: 200 },
      animationLoop: undefined,
      candlesHover: false,
      infoCandles: {},
      mouse: { x: undefined, y: undefined },
      prices: { high: 2, middle: 1, low: 0 },
      lastCandle: [Date.now(), 16465, 16493, 16479, 16489, 5.32],
    };
  },
  mounted() {
    this.startingWork();
  },
  computed: {
    ...mapGetters(["CANDLES"]),
    isInfoPosition() {
      const blockWidth = 80;
      return this.candlesCanvasSize.width - this.infoCandles.coords.x2 >
        blockWidth
        ? true
        : false;
    },
  },
  watch: {
    candlesHover(val) {
      if (val) {
        this.workCandles();
      }
    },
    testff(val) {
      console.log(val);
    },
  },
  methods: {
    ...mapActions(["GET_CANDLES_FROM_API"]),
    workCandles() {
      const canvas = document.querySelector("#canvas");
      // vars
      const ctx = canvas.getContext("2d");
      canvas.style.width = this.candlesCanvasSize.width;
      canvas.style.height = this.candlesCanvasSize.height;
      const width = (canvas.width = this.candlesCanvasSize.width);
      const height = (canvas.height = this.candlesCanvasSize.height);
      // vars
      const candles = new Candles(ctx, this.candlesData, width, height);
      candles.startWork();
      this.allCandlesData = candles.allCandlesData;
      this.hoverOnCandle(this.allCandlesData);
      // remove animation, reset mouse
      if (!this.candlesHover) {
        this.mouse = { x: undefined, y: undefined };
        cancelAnimationFrame(this.animationLoop);
        return;
      }
      // loop
      this.animationLoop = requestAnimationFrame(this.workCandles);
    },
    hoverOnCandle(candles) {
      this.infoCandles = {};
      candles.forEach((candle) => {
        const { coords, data } = candle;
        if (
          coords.x1 <= this.mouse.x &&
          coords.x2 >= this.mouse.x &&
          coords.y1 <= this.mouse.y &&
          coords.y2 >= this.mouse.y &&
          this.candlesHover
        ) {
          //time low high open close vol
          this.infoCandles.coords = coords;
          this.infoCandles.data = [
            `low: ${data[1]}$`,
            `high: ${data[2]}$`,
            `open: ${data[3]}$`,
            `close: ${data[4]}$`,
            `vol: ${data[5]}$`,
          ];
          return;
        }
        //  else
      });
    },
    moveMouseOnCanvas(event) {
      this.mouse = { x: event.offsetX, y: event.offsetY };
    },
    createDateString(date) {
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:00`;
    },
    getAverageCost() {
      const sortArr = (cb) => [...this.candlesData].sort((a, b) => cb(a, b))[0];
      const lowArr = sortArr((a, b) => a[1] - b[1]) ?? [1, 2, 3];
      const highArr = sortArr((a, b) => b[2] - a[2]) ?? [1, 2, 3];
      this.prices.low = lowArr[1];
      this.prices.high = highArr[2];
      this.prices.middle = Math.floor((this.prices.low + this.prices.high) / 2);
    },
    async startingWork() {
      const pair = this.curpair;
      const granules = 60;
      const dateNow = new Date(Date.now());
      const datePast = new Date(Date.now() - 36e5 * 5);
      const dateStart = this.createDateString(datePast);
      const dateEnd = this.createDateString(dateNow);
      await this.GET_CANDLES_FROM_API({
        pair,
        granules,
        dateStart,
        dateEnd,
      });
      this.candlesData = this.CANDLES.slice(this.CANDLES.length - 10);
      this.candlesData.push(lastCandleSocket);
      this.getAverageCost();
      this.workCandles();
      this.lastCandle = lastCandleSocket;
      // console.log(this.lastCandle);
    },
  },
};
</script>