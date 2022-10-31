<template>
  <div class="fa_chart">
    <h3 class="fa_training_title">
      Chart {{curpair}}
    </h3>
    <div class="chart_container">
      <div
        class="info_cur_dot"
        v-show="chartHover"
        :style="{
        top: positionInfo? '70%':'0'
      }"
      >
        TIME: {{timeBucketStart}} <br>
        lower price:
        <!-- during the bucket interval: -->
        <span class="main_data">
          {{currentTradingData.close}}
        </span>

        <br>
        Highest price:
        <!-- during the bucket interval: -->
        <span class="main_data">
          {{currentTradingData.high}}
        </span>
        <br>
        Volume of trading activity:
        <!-- during the bucket interval:  -->
        <span class="main_data">
          {{currentTradingData.vol}}
        </span>
      </div>

      <!-- canvas -->
      <!-- canvas -->
      <table class="table_chart">
        <tr>
          <td>
            <canvas
              id="canvasChart"
              @mousemove="moveMouseOnCanvas($event)"
              @mouseover="chartHover = true"
              @mouseout="chartHover = false"
            > </canvas>
          </td>
          <td>
            <canvas id="canvasPrice"></canvas>
          </td>
        </tr>
        <tr>
          <td>
            <canvas id="canvasTime"></canvas>
          </td>
        </tr>
      </table>

      <!-- canvas -->
      <!-- canvas -->
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Chart from "../../js/chart/chart";
import Scale from "../../js/chart/scale";
// ALCX COMP XCN
export default {
  name: "fa-training",
  data() {
    return {
      curpair: "BTC-USD",
      currentTradingData: {},
      allChartData: [],
      candles: [],
      numCandles: 0,
      chartHover: false,
      chartCanvas: null,
      animationLoop: undefined,
      chartSizes: {
        chartWidth: 400,
        chartHeight: 300,
        axisWidth: 50,
      },
      windowSize: "sm",
      allChartSizes: {
        sm: { chartWidth: 250, chartHeight: 300, axisWidth: 50 },
        md: { chartWidth: 400, chartHeight: 300, axisWidth: 50 },
        lg: { chartWidth: 600, chartHeight: 400, axisWidth: 50 },
      },
      prices: {
        high: 2,
        middle: 1,
        low: 0,
      },
      mouse: {
        x: undefined,
        y: undefined,
      },
    };
  },
  mounted() {
    this.startingWork();
    this.chartSizes = this.allChartSizes["sm"];
    this.changeChartSizes();
    window.addEventListener("resize", this.changeChartSizes);
  },
  unmounted() {},
  computed: {
    ...mapGetters(["CANDLES"]),
    timeBucketStart() {
      if (!this.currentTradingData.time) return;
      return new Date(this.currentTradingData.time);
    },
    positionInfo() {
      return this.mouse.y < this.chartSizes.chartHeight / 2;
    },
  },
  watch: {
    chartHover(val) {
      if (val) {
        this.canvasChart();
      }
    },
    windowSize(val) {
      this.chartSizes = this.allChartSizes[val];
      this.canvasChart();
      this.startDrawAxes();
    },
  },
  methods: {
    ...mapActions(["GET_CANDLES_TO_CURRENCY_PAIR_FROM_API"]),
    canvasChart() {
      const canvas = document.querySelector("#canvasChart");
      if (!canvas) return;
      const width = (canvas.width = this.chartSizes.chartWidth);
      const height = (canvas.height = this.chartSizes.chartHeight);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const ctx = canvas.getContext("2d");
      const amount = (width / this.numCandles).toFixed(1);
      const range = this.prices.middle - this.prices.low;
      this.chartCanvas = new Chart(
        ctx,
        width,
        height,
        amount,
        range,
        this.prices.middle,
        this.candles
      );
      // get all chart data
      if (!this.allChartData.length) {
        this.allChartData = this.chartCanvas.chartPartsData;
      }

      this.chartCanvas.updateCanvas();

      // drawChart
      this.chartCanvas.drawChart();
      // drawChart

      // marking lines
      // this.chartCanvas.drawVerticalLine(0, 0);
      this.chartCanvas.drawHorizonLine(0, height);
      // middle
      this.chartCanvas.drawHorizonLine(width / 2, height / 2);
      // marking lines
      // get info, draw circle, cross
      if (this.chartHover && this.mouse.x) {
        const curRadius = 3;
        const data = this.chartCanvas.selectedData(this.mouse.x);
        this.chartCanvas.drawHorizonLine(this.mouse.x, this.mouse.y);
        this.chartCanvas.drawVerticalLine(this.mouse.x, this.mouse.y);
        if (data) {
          this.currentTradingData = data.tradingData;
          this.chartCanvas.drawCircle(data.x, data.y, curRadius, data.color);
        }
      }
      // get info, draw circle, cross

      // remove animation, reset mouse
      if (!this.chartHover) {
        this.mouse = { x: undefined, y: undefined };
        cancelAnimationFrame(this.animationLoop);
        return;
      }

      //loop
      this.animationLoop = requestAnimationFrame(this.canvasChart);
      // console.log("loop");
    },
    canvasTime(chartWidth, axisWidth) {
      const canvas = document.querySelector("#canvasTime");
      canvas.width = chartWidth;
      canvas.height = axisWidth;
      canvas.style.width = chartWidth + "px";
      canvas.style.height = axisWidth + "px";
      const ctx = canvas.getContext("2d");
      const axis = "x";
      const numOfSteps = 5;
      const param = "time";
      const scaleTime = new Scale(
        ctx,
        this.allChartData,
        axis,
        chartWidth,
        numOfSteps,
        param
      );
      scaleTime.drawTime();
    },
    canvasPrice(chartHeight, axisWidth) {
      const canvas = document.querySelector("#canvasPrice");
      canvas.width = axisWidth;
      canvas.height = chartHeight;
      canvas.style.width = axisWidth + "px";
      canvas.style.height = chartHeight + "px";
      const ctx = canvas.getContext("2d");
      const axis = "y";
      const numOfSteps = 7;
      const param = "close";
      const scaleTime = new Scale(
        ctx,
        this.allChartData,
        axis,
        chartHeight,
        numOfSteps,
        param
      );
      scaleTime.drawPriceScales();
    },
    startDrawAxes() {
      if (this.allChartData.length === 0) return;
      const chartWidth = this.chartSizes.chartWidth;
      const chartHeight = this.chartSizes.chartHeight;
      const axisWidth = this.chartSizes.axisWidth;
      this.canvasTime(chartWidth, axisWidth);
      this.canvasPrice(chartHeight, axisWidth);
    },
    getCurrentChartSizes() {
      return this.chartSizes[this.windowSize];
    },
    changeChartSizes() {
      const currentWindowSize = window.innerWidth;
      const breakpoints = [530, 800];
      const sizes = ["sm", "md", "lg"];
      const bpIndex = breakpoints.findIndex((i) => i > currentWindowSize);
      const index = bpIndex < 0 ? 2 : bpIndex;
      if (this.windowSize !== sizes[index]) {
        this.windowSize = sizes[index];
      }
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
      const sortArr = (cb) => [...this.candles].sort((a, b) => cb(a, b))[0];
      const lowArr = sortArr((a, b) => a[1] - b[1]) ?? [1, 2, 3];
      const highArr = sortArr((a, b) => b[2] - a[2]) ?? [1, 2, 3];
      this.prices.low = lowArr[1];
      this.prices.high = highArr[2];
      this.prices.middle = (this.prices.low + this.prices.high) / 2;
    },
    async startingWork() {
      const pair = this.curpair;
      const dateNow = new Date(Date.now());
      const datePast = new Date(Date.now() - 36e5 * 5);
      const dateStart = this.createDateString(datePast);
      const dateEnd = this.createDateString(dateNow);
      await this.GET_CANDLES_TO_CURRENCY_PAIR_FROM_API({
        pair,
        dateStart,
        dateEnd,
      });
      this.candles = this.CANDLES.sort((a, b) => a[0] - b[0]);
      this.numCandles = this.candles.length;
      this.getAverageCost();
      this.canvasChart();
      this.startDrawAxes();
    },
  },
};
</script>
