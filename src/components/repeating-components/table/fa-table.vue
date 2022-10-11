<template>
  <section class="section_all_currencies">
    <div class="search_token">
      <input
        type="text"
        v-model="filter"
      >
      <button @click="clickBtn">click</button>
    </div>

    <table class="table_all_currencies">

      <caption class="table_title">
        {{titleTable}} {{selectedFiat}}
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
        v-for=" (item, i) in  paginatedCurrencies"
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
          <br v-if='wrapWordCur'>
          {{` ${selectedFiat}`}}
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
export default {
  name: "fa-table",
  props: {
    titleTable: {
      type: String,
      required: false,
      default: "Table",
    },
    selectedFiat: {
      type: String,
      required: false,
      default: "USD",
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
      this.infoCurrencies.forEach((item) => {
        if (item.price !== undefined) {
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
        return;
      } else if (!this.isFullListCurrencies) {
        this.numberOfCurrencies = this.listAllFiat.length;
        return;
      }
    },
    showFullPrice(i) {
      if (this.listAllFiat[i].price === this.infoCurrencies[i].price) {
        return (this.listAllFiat[i].price = this.normalizePrice(
          this.listAllFiat[i].price
        ));
      }
      return (this.listAllFiat[i].price = this.infoCurrencies[i].price);
    },
    resizeWindow() {
      this.wrapWordCur = window.innerWidth < 550;
    },
  },
  mounted() {
    this.setNormalizePrices();
    this.resizeWindow();
    window.addEventListener("resize", this.resizeWindow);
  },
  unmount() {
    window.removeEventListener("resize", this.resizeWindow);
  },
};
</script>
