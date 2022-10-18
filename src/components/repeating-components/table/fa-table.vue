<template>
  <section class="section_all_currencies">
    <!-- <div class="search_token">
      <input
        type="text"
        v-model="filter"
        placeholder="search"
      >
      <button @click="clickBtn">&#x1F50E;&#xFE0E;</button>
    </div> -->

    <table class="table_all_currencies">

      <caption class="table_title">
        {{titleTable}} {{SELECTED_CURRENCY}}
      </caption>

      <tr class="table_row_title">
        <th
          class="table_colum_title"
          v-for="header in headersColum"
          :key="header"
        >
          {{header}}
        </th>
      </tr>

      <tr
        class="currency_item_row"
        v-for=" item in  paginatedCurrencies"
        :key="item"
      >
        <td class="currency_item_cell">
          <span
            class="currency_item_cell_circle"
            :style="{
              background: `hsl(${item.color}, 100%, 50%)`
            }"
          ></span>
          {{item.id}}
        </td>
        <td
          class="currency_item_cell"
          v-html="wrapNamePart(item.name)"
        >

        </td>
        <td
          class="currency_item_cell"
          @click="changePriceLength(item)"
        >
          <!--  :style="{'color':typeof item.price === 'number'?'#fff':'#ccc'}" -->
          {{`${item.price}`}}
          <br v-if='wrapWordCur'>
          {{` ${SELECTED_CURRENCY}`}}
        </td>
      </tr>

    </table>

    <button
      class="show_more_currencies"
      @click="newNumberOfCurrencies"
      :style="{
          'opacity': isFullListCurrencies ? 0.2 : 1,
          'cursor': isFullListCurrencies ? 'initial' : 'pointer'
          }"
    >
      Show More
    </button>

  </section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "fa-table",
  props: {
    titleTable: {
      type: String,
      required: false,
      default: "Table",
    },
    headersColum: {
      type: Array,
      required: true,
    },
    infoCurrencies: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filter: "",
      numberOfCurrencies: 10,
      wrapWordCur: false,
      listAllFiat: [],
    };
  },
  computed: {
    ...mapGetters(["SELECTED_CURRENCY", "FILTER"]),
    filteredListCurrencies() {
      const filterKey = ["id", "name"];
      return this.listAllFiat.filter((item) => {
        return filterKey.some((key) => {
          return item[key].toUpperCase().includes(this.filter.toUpperCase());
        });
      });
    },
    paginatedCurrencies() {
      return this.filteredListCurrencies.slice(0, this.numberOfCurrencies);
    },
    isFullListCurrencies() {
      return this.filteredListCurrencies.length <= this.numberOfCurrencies;
    },
  },
  methods: {
    wrapNamePart(str) {
      if (this.wrapWordCur) {
        const arr = str.split(" ");
        return [...arr.slice(0, 2), "<br>", ...arr.slice(2)].join(" ");
      }
      return str;
    },
    normalizePrice(price) {
      if (price > 1) {
        return Number(price.toFixed(1));
      } else return Number(price.toPrecision(3));
    },
    setNormalizePrices() {
      this.infoCurrencies.forEach((item) => {
        if (item.price) {
          const price = this.normalizePrice(item.price);
          this.listAllFiat.push({ ...item, price });
          return;
        }
        this.listAllFiat.push({ ...item, price: "-" });
      });
    },
    newNumberOfCurrencies() {
      if (this.filteredListCurrencies.length > this.numberOfCurrencies + 10) {
        this.numberOfCurrencies += 10;
      } else if (!this.isFullListCurrencies) {
        this.numberOfCurrencies = this.listAllFiat.length;
      }
    },
    changePriceLength(item) {
      const fullPrice = this.infoCurrencies.find((i) => i.id === item.id).price;
      if (typeof item.price === "string") return;
      if (fullPrice === item.price) {
        item.price = this.normalizePrice(item.price);
      } else item.price = fullPrice;
    },
    resizeWindow() {
      this.wrapWordCur = window.innerWidth < 550;
    },
  },
  watch: {
    FILTER(val) {
      this.filter = val;
    },
  },
  mounted() {
    this.setNormalizePrices();
    this.resizeWindow();
    this.filter = this.FILTER;
    window.addEventListener("resize", this.resizeWindow);
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeWindow);
  },
};
</script>
