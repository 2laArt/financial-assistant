<template>
  <div class="fa_currency">
    <div class="ff">
      <input
        class="curVal"
        type="text"
        v-model="currentFiat"
      >
      <button @click="clickBtn">click</button>
    </div>

    <section class="section_all_currencies">

      <table class="table_all_currencies">

        <caption class="table_title">
          Table of all currencies to {{currentFiat}}
        </caption>

        <tr class="table_row_title">
          <th class="table_colum_title">Marker</th>
          <th class="table_colum_title">Full Title</th>
          <th class="table_colum_title">Price</th>
        </tr>

        <tr
          class="currency_item_row"
          v-for=" (item, i) in  currenciesList"
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
            @click="showFullPrice(i)"
            :style="{'color':typeof item.price === 'number'?'#fff':'inhiret'}"
          >
            {{`${item.price}`}}
            <br v-if="wrapWordCur">
            {{` ${currentFiatUp}`}}
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

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "fa-currency",
  data() {
    return {
      currentFiat: "USD",
      numberOfCurrencies: 160,
      listAllFiat: [],
      wrapWordCur: false,
    };
  },
  created() {
    const isLoadPrices = new Promise((resolve) =>
      resolve(Object.keys(this.allPirces).length === 0)
    );
    const f = async () => {
      await isLoadPrices;
      await this.xGetlLstAllCurrency();
      await this.xAddPricesToCurrencies();
      await this.setNormalizePrices();
    };
    f();
  },
  mounted() {
    this.resizeWindow();
    window.addEventListener("resize", this.resizeWindow);
  },
  ummount() {
    window.removeEventListener("resize", this.resizeWindow);
  },
  beforeUnmount() {
    // console.log("currencies unmount");
  },
  watch: {},
  computed: {
    ...mapGetters({
      allPirces: "PRICE_ALL_ITEM",
      currencies: "CURRENCIES",
    }),
    currenciesList() {
      return this.listAllFiat.slice(0, this.numberOfCurrencies);
    },
    currentFiatUp() {
      return this.currentFiat.toUpperCase();
    },
    isFullListCurrencies() {
      return this.currencies.length === this.numberOfCurrencies;
    },
  },
  methods: {
    ...mapActions({
      xGetlLstAllCurrency: "GET_LIST_ALL_CURRENCIES_FROM_API",
    }),
    ...mapMutations({
      xAddPricesToCurrencies: "ADD_PRICES_TO_CURRENCIES",
    }),
    resizeWindow() {
      this.wrapWordCur = window.innerWidth < 550;
    },
    wrapNamePart(str) {
      if (this.wrapWordCur) {
        const arr = str.split(" ");
        return [...arr.slice(0, 2), "<br>", ...arr.slice(2)].join(" ");
      }
      return str;
    },
    normalizePrice(price) {
      const afterPoint = price.split(".")[1];
      if (typeof afterPoint === "string") {
        if (afterPoint.length > 3) {
          return (
            (price > 1
              ? Number(price).toFixed(3)
              : Number(price).toPrecision(3)) + "..."
          );
        }
      }
      return price;
    },
    setNormalizePrices() {
      // if(this.currencies.length < 1){
      //   this.
      //   }
      this.currencies.forEach((item) => {
        if (item.price !== undefined) {
          const price = this.normalizePrice(item.price);
          this.listAllFiat.push({ ...item, price });
          return;
        }
        this.listAllFiat.push({ ...item, price: "-" });
      });
    },
    newNumberOfCurrencies() {
      if (this.listAllFiat.length > this.numberOfCurrencies + 10) {
        this.numberOfCurrencies += 10;
        return;
      } else if (!this.isFullListCurrencies) {
        this.numberOfCurrencies = this.listAllFiat.length;
        return;
      }
    },
    showFullPrice(i) {
      if (this.listAllFiat[i].price === this.currencies[i].price) {
        return (this.listAllFiat[i].price = this.normalizePrice(
          this.listAllFiat[i].price
        ));
      }
      return (this.listAllFiat[i].price = this.currencies[i].price);
    },
  },
};
</script>