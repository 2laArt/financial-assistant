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
        v-if="infoCandles.data && candlesHover"
        :style="{
          'top': isInfoPositionY,
          'left':isInfoPositionX,
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
import { getUpdatePrice } from "../../js/candles/last-candle-socket";
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
      lastCandle: [],
    };
  },
  mounted() {
    this.startingWork();
  },
  computed: {
    ...mapGetters(["CANDLES"]),
    isInfoPositionX() {
      const blockWidth = 80;
      return this.candlesCanvasSize.width - this.infoCandles.coords.x2 >
        blockWidth
        ? `${this.infoCandles.coords.x2 + 10}px`
        : `${this.infoCandles.coords.x1 - blockWidth}px`;
    },
    isInfoPositionY() {
      const blockHeight = 70;
      return this.candlesCanvasSize.height - this.infoCandles.coords.y1 >
        blockHeight
        ? `${this.infoCandles.coords.y1}px`
        : `${this.infoCandles.coords.y2 - blockHeight}px`;
    },
    posInfo() {
      return {
        bottom: "100px",
        left: "100%",
      };
    },
  },
  watch: {},
  methods: {
    ...mapActions(["GET_CANDLES_FROM_API"]),
    workCandles(price) {
      const canvas = document.querySelector("#canvas");
      if (!canvas) return;
      // vars
      const ctx = canvas.getContext("2d");
      canvas.style.width = this.candlesCanvasSize.width;
      canvas.style.height = this.candlesCanvasSize.height;
      const width = (canvas.width = this.candlesCanvasSize.width);
      const height = (canvas.height = this.candlesCanvasSize.height);
      // vars
      this.candlePrices(
        this.candlesData[this.candlesData.length - 1][4],
        price
      );
      const candles = new Candles(ctx, this.candlesData, width, height);
      candles.startWork();
      this.allCandlesData = candles.allCandlesData;
      // remove animation, reset mouse
      if (!this.candlesHover) {
        this.mouse = { x: undefined, y: undefined };
      }
      this.hoverOnCandle();
    },
    hoverOnCandle() {
      this.infoCandles = {};
      this.allCandlesData.forEach((candle) => {
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
            // `time: ${data[0].getHours()}`,
            `low: ${data[1]}$`,
            `high: ${data[2]}$`,
            `open: ${data[3]}$`,
            `close: ${data[4]}$`,
          ];
          // return;
        }
      });
    },
    moveMouseOnCanvas(event) {
      this.mouse = { x: event.offsetX, y: event.offsetY };
      this.hoverOnCandle();
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
    candlePrices(closePrice, price) {
      if (
        this.lastCandle.length === 0 ||
        this.lastCandle[0] + 6e4 < Date.now()
      ) {
        const numOfElem = 4;
        this.lastCandle = [Date.now(), ...Array(numOfElem).fill(closePrice)];
        this.candlesData.shift();
        this.candlesData.push(this.lastCandle);
      }
      this.changeLastCandlesPrice(price);
    },
    changeLastCandlesPrice(price) {
      if (!this.lastCandle[3]) this.lastCandle[3] = price;
      if (this.lastCandle[1] > price || !this.lastCandle[1])
        this.lastCandle[1] = price;
      if (this.lastCandle[2] < price || !this.lastCandle[2])
        this.lastCandle[2] = price;
      this.lastCandle[4] = price;
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
      this.getAverageCost();
      this.workCandles();
      getUpdatePrice(this.curpair, (price) => this.workCandles(price));
    },
  },
};
</script>