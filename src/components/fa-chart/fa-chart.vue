<template>
  <div class="fa_chart">
    <select
      name="crypto"
      id="selectCrypto"
      onfocus='this.size=10;'
      onblur='this.size=1;'
      onchange='this.size=1; this.blur();'
      v-model="curCoin"
    >
      <option
        v-for="coin in CRYPTO"
        :key="coin"
        :value="coin.id"
      >{{coin.id}}</option>
    </select>
    <h3 class="fa_training_title">
      Chart {{curCoin}}-USD
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
export default {
  name: "fa-training",
  data() {
    return {
      curCoin: "BTC",
      currentTradingData: {},
      chartData: [],
      numCandles: 0,
      chartHover: false,
      animationLoop: undefined,
      chartSizes: {},
      windowSize: "",
      isResizeWindow: false,
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
    this.changeChartSizes();
    window.addEventListener("resize", this.changeChartSizes);
  },
  unmounted() {
    window.removeEventListener("resize", this.changeChartSizes);
  },
  computed: {
    ...mapGetters(["CHART", "CRYPTO"]),
    timeBucketStart() {
      if (!this.currentTradingData.time) return;
      return new Date(this.currentTradingData.time);
    },
    positionInfo() {
      return this.mouse.y < this.chartSizes.chartHeight / 2;
    },
    candlesSmall() {
      if (this.windowSize === "sm" && this.chartData.length > 61) {
        return this.chartData.slice(this.chartData.length - 60);
      } else if (this.windowSize === "md" && this.chartData.length > 101) {
        return this.chartData.slice(this.chartData.length - 100);
      } else {
        return this.chartData;
      }
    },
  },
  watch: {
    chartHover(val) {
      if (val) {
        this.canvasChart();
      }
    },
    windowSize(val) {
      this.isResizeWindow = true;
      this.chartSizes = this.allChartSizes[val];
      this.canvasChart();
    },
    curCoin() {
      this.startingWork();
    },
  },
  methods: {
    ...mapActions(["GET_CHART_TO_CURRENCY_PAIR_FROM_API"]),
    canvasChart() {
      const canvas = document.querySelector("#canvasChart");
      // window.devicePixelRatio > 1 ? 1.2 : 1
      const ratio = 1;
      if (!canvas) return;

      // vars
      const ctx = canvas.getContext("2d");
      const width = (canvas.width = this.chartSizes.chartWidth * ratio);
      const height = (canvas.height = this.chartSizes.chartHeight * ratio);
      const data = this.candlesSmall ?? [];
      const amountDot = (width / data.length).toFixed(1);
      const priceRange = this.prices.middle - this.prices.low;
      // vars
      // styles
      canvas.style.width = this.chartSizes.chartWidth + "px";
      canvas.style.height = this.chartSizes.chartHeight + "px";

      ctx.scale(ratio, ratio);
      // create chart
      const chartCanvas = new Chart(
        ctx,
        width,
        height,
        amountDot,
        priceRange,
        this.prices.middle,
        data
      );
      // clear
      chartCanvas.updateCanvas();

      // drawChart
      chartCanvas.drawChart();
      // drawChart

      // marking lines
      // chartCanvas.drawVerticalLine(0, 0);
      // chartCanvas.drawHorizonLine(0, height);
      // middle
      chartCanvas.drawHorizonLine(width / 2, height / 2);
      // marking lines
      // get info, draw circle, cross
      if (this.chartHover && this.mouse.x) {
        const curRadius = 3;
        const data = chartCanvas.selectedData(this.mouse.x);
        chartCanvas.drawHorizonLine(this.mouse.x, this.mouse.y);
        chartCanvas.drawVerticalLine(this.mouse.x, this.mouse.y);
        if (data) {
          this.currentTradingData = data.tradingData;
          chartCanvas.drawCircle(data.x, data.y, curRadius, data.color);
        }
      }
      // get info, draw circle, cross

      // get all chart data
      if (chartCanvas.chartPartsData.length !== 0 && this.isResizeWindow) {
        const allData = chartCanvas.chartPartsData;
        this.canvasTime(allData, ratio);
        this.canvasPrice(allData, ratio);
        this.isResizeWindow = false;
      }

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
    canvasTime(allData, ratio) {
      const canvas = document.querySelector("#canvasTime");
      canvas.style.width = this.chartSizes.chartWidth + "px";
      canvas.style.height = this.chartSizes.axisWidth + "px";
      const width = (canvas.width = this.chartSizes.chartWidth * ratio);
      const height = (canvas.height = this.chartSizes.axisWidth * ratio);
      const ctx = canvas.getContext("2d");
      ctx.scale(ratio, ratio);
      // vars
      height;
      const data = allData;
      const axis = "x";
      const numOfSteps = 5;
      const param = "time";
      // vars
      // create scale
      const scaleTime = new Scale(ctx, data, axis, width, numOfSteps, param);
      scaleTime.drawTime();
    },
    canvasPrice(allData, ratio) {
      const canvas = document.querySelector("#canvasPrice");
      const width = (canvas.width = this.chartSizes.axisWidth * ratio);
      const height = (canvas.height = this.chartSizes.chartHeight * ratio);
      canvas.style.width = this.chartSizes.axisWidth + "px";
      canvas.style.height = this.chartSizes.chartHeight + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(ratio, ratio);

      // vars
      width;
      const data = allData;
      const axis = "y";
      const numOfSteps = 7;
      const param = "close";
      // vars
      // create scale
      const scaleTime = new Scale(ctx, data, axis, height, numOfSteps, param);
      scaleTime.drawPriceScales();
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
      const sortArr = (cb) => [...this.chartData].sort((a, b) => cb(a, b))[0];
      const lowArr = sortArr((a, b) => a[1] - b[1]) ?? [1, 2, 3];
      const highArr = sortArr((a, b) => b[2] - a[2]) ?? [1, 2, 3];
      this.prices.low = lowArr[1];
      this.prices.high = highArr[2];
      this.prices.middle = (this.prices.low + this.prices.high) / 2;
    },
    async startingWork() {
      this.isResizeWindow = true;
      const pair = `${this.curCoin}-USD`;
      const granules = 900; //60, 300, 900, 3600, 21600, 86400
      const dateNow = new Date(Date.now());
      const datePast = new Date(Date.now() - 36e5 * 27);
      const dateStart = this.createDateString(datePast);
      const dateEnd = this.createDateString(dateNow);
      await this.GET_CHART_TO_CURRENCY_PAIR_FROM_API({
        pair,
        granules,
        dateStart,
        dateEnd,
      });
      this.chartData = [...this.CHART].sort((a, b) => a[0] - b[0]);
      this.getAverageCost();
      this.canvasChart();
    },
  },
};
</script>
