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
      candlesCanvasSize: {},
      allCanvasSizes: {
        sm: {
          canvasWidth: 250,
          canvasHeight: 200,
          amount: 15,
          candleWidth: 10,
        },
        md: {
          canvasWidth: 400,
          canvasHeight: 300,
          amount: 25,
          candleWidth: 10,
        },
        lg: {
          canvasWidth: 600,
          canvasHeight: 400,
          amount: 40,
          candleWidth: 10,
        },
      },
      windowSize: "",
      candlesHover: false,
      infoCandles: {},
      mouse: { x: undefined, y: undefined },
      candlesCoordsData: null,
      candlesData: [],
      lastCandle: [],
    };
  },
  mounted() {
    this.changeCanvasSizes();
    window.addEventListener("resize", this.changeCanvasSizes);
    this.startingWork();
  },
  unmounted() {
    window.removeEventListener("resize", this.changeCanvasSizes);
  },
  computed: {
    ...mapGetters(["CANDLES"]),
    isInfoPositionX() {
      const blockWidth = 80;
      return this.candlesCanvasSize.canvasWidth - this.infoCandles.coords.x2 >
        blockWidth
        ? `${this.infoCandles.coords.x2 + 10}px`
        : `${this.infoCandles.coords.x1 - blockWidth}px`;
    },
    isInfoPositionY() {
      const blockHeight = 70;
      return this.candlesCanvasSize.canvasHeight - this.infoCandles.coords.y1 >
        blockHeight
        ? `${this.infoCandles.coords.y1}px`
        : `${this.infoCandles.coords.y2 - blockHeight}px`;
    },
    currentNumberOfCandles() {
      return this.candlesData.slice(
        this.candlesData.length - this.candlesCanvasSize.amount
      );
    },
  },
  watch: {
    windowSize(val) {
      this.candlesCanvasSize = this.allCanvasSizes[val];
      getUpdatePrice(this.curpair, (price) => this.workCandles(price));
    },
  },
  methods: {
    ...mapActions(["GET_CANDLES_FROM_API"]),
    workCandles(price) {
      const canvas = document.querySelector("#canvas");
      if (!canvas || !this.currentNumberOfCandles) return;
      // vars
      const ctx = canvas.getContext("2d");
      canvas.style.width = this.candlesCanvasSize.canvasWidth;
      canvas.style.height = this.candlesCanvasSize.canvasHeight;
      const width = (canvas.width = this.candlesCanvasSize.canvasWidth);
      const height = (canvas.height = this.candlesCanvasSize.canvasHeight);
      const closePriceIdx = 4;
      // vars
      this.candlePrices(
        this.currentNumberOfCandles[this.currentNumberOfCandles.length - 1][
          closePriceIdx
        ],
        price
      );
      const candles = new Candles(
        ctx,
        this.currentNumberOfCandles,
        width,
        height,
        this.candlesCanvasSize.candleWidth
      );
      candles.updateCanvas();
      candles.startWork();
      this.candlesCoordsData = candles.allCandlesData;
      // remove animation, reset mouse
      if (!this.candlesHover) {
        this.mouse = { x: undefined, y: undefined };
      }
      this.hoverOnCandle();
    },
    hoverOnCandle() {
      this.infoCandles = {};
      this.candlesCoordsData.forEach((candle) => {
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
      if (this.candlesCoordsData) this.hoverOnCandle();
    },
    createDateString(date) {
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:00`;
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
    changeCanvasSizes() {
      const currentWindowSize = window.innerWidth;
      const breakpoints = [530, 800];
      const sizes = ["sm", "md", "lg"];
      const bpIndex = breakpoints.findIndex((i) => i > currentWindowSize);
      const index = bpIndex < 0 ? 2 : bpIndex;
      if (this.windowSize !== sizes[index]) {
        this.windowSize = sizes[index];
      }
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
      this.candlesData = this.CANDLES;
      getUpdatePrice(this.curpair, (price) => this.workCandles(price));
    },
  },
};
</script>