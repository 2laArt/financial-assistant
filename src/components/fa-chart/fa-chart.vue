<template>
  <div class="fa_chart">
    <h3 class="fa_training_title">
      Chart {{curpair}}
    </h3>
    <div class="cord_mouse">
    </div>
    <div class="box">
      <div
        class="info_TEST"
        v-show="chartHover"
        :style="{
        top: posInfo? '50%':'0'
      }"
      >
        TIME: {{timeBucketStart}} <br>
        Lowest price during the bucket interval:
        <span class="main_data">
          {{tradingData.low}}
        </span>

        <br>
        Highest price during the bucket interval:
        <span class="main_data">
          {{tradingData.high}}
        </span>
        <br>
        Volume of trading activity during the bucket interval: <span class="main_data">
          {{tradingData.vol}}
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
            <canvas
              id="canvasPrice"
              :style="{
              'width': `${sizeScales.price[0]}px`,
              'height': `${sizeScales.price[1]}px`,
              }"
            ></canvas>
          </td>
        </tr>
        <tr>
          <td>
            <canvas
              id="canvasTime"
              :style="{
              'width':`${sizeScales.time[0]}px` ,
              'height': `${sizeScales.time[1]}px`,
              }"
            ></canvas>
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
      tradingData: {},
      curpair: "BTC-USD",
      candles: [],
      numCandles: 0,
      chartHover: false,
      chart: null,
      rt: undefined,
      sizeScales: {
        price: ["60", "200"],
        time: ["400", "60"],
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
    document.body.overflow = "hidden";
  },
  computed: {
    ...mapGetters(["CANDLES"]),
    timeBucketStart() {
      if (!this.tradingData.time) return;
      return new Date(this.tradingData.time * 1000);
    },
    posInfo() {
      return this.mouse.y < 100;
    },
  },
  watch: {
    chartHover(val) {
      if (val) {
        this.canvasChart();
      }
    },
  },
  methods: {
    ...mapActions(["GET_CANDLES_TO_CURRENCY_PAIR_FROM_API"]),
    canvasChart() {
      const canvas = document.querySelector("#canvasChart");
      const ctx = canvas.getContext("2d");
      const width = (canvas.width = 400);
      const height = (canvas.height = 200);
      const amount = (width / this.numCandles).toFixed(1);
      const range = this.prices.middle - this.prices.low;

      this.chart = new Chart(
        ctx,
        width,
        height,
        amount,
        range,
        this.prices.middle,
        this.candles
      );

      this.chart.upDateCanvas(this.mouse.x);

      // marking lines
      // this.chart.drawVerticalLine(0, 0);
      this.chart.drawHorizonLine(0, height);
      // middle
      this.chart.drawHorizonLine(width / 2, height / 2);
      // marking lines
      this.chart.drawChart();

      if (!this.chartHover) {
        this.mouse = { x: undefined, y: undefined };
        cancelAnimationFrame(this.rt);
      }

      if (this.chartHover && this.mouse.x) {
        const curRadius = 3;
        const data = this.chart.selectedData(this.mouse.x);
        if (data) {
          this.tradingData = data.tradingData;
          this.chart.drawCircle(data.x, data.y, curRadius, data.color);
        }
      }
      this.chart.drawHorizonLine(this.mouse.x, this.mouse.y);
      this.chart.drawVerticalLine(this.mouse.x, this.mouse.y);

      this.rt = requestAnimationFrame(this.canvasChart);
    },
    canvasTime() {
      const canvas = document.querySelector("#canvasTime");
      canvas.width = this.sizeScales.time[0];
      canvas.height = this.sizeScales.time[1];
      const ctx = canvas.getContext("2d");
      const start = this.candles[0][0];
      const end = this.candles[this.candles.length - 1][0];
      const scaleTime = new Scale(
        ctx,
        true,
        this.sizeScales.time[0],
        start,
        end
      );
      scaleTime.computedCoordinatesPosition();
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
    getChartInterval() {
      const start = new Date(this.candles[0][0] * 1000);
      const end = new Date(this.candles[this.candles.length - 1][0] * 1000);
      const startHours = start.getHours();
      const startMitutes = start.getMinutes();
      const endHours = end.getHours();
      const endMinutes = end.getMinutes();
      console.log(`${startHours}: ${startMitutes}`);
      console.log(`${endHours}: ${endMinutes}`);
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
      // this.getChartInterval();

      this.canvasTime();
      this.canvasChart();
    },
  },
};
</script>
