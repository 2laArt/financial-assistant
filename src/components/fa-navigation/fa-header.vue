<template>
  <header class="fa_header">
    <div class="header_container">
      <div class="logo header_item">FA</div>
      <div class="search">
        <input
          type="text"
          v-model="filter"
          placeholder="search"
        >
        <button>&#x1F50E;&#xFE0E;</button>
      </div>
      <div class="hub header_item">
        <select
          class="selected_currency"
          v-model="selectedCurrency"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="RUB">RUB</option>
        </select>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "fa-top-panel",
  data() {
    return {
      filter: "",
      selectedCurrency: "",
    };
  },
  watch: {
    selectedCurrency(val) {
      this.CHANGE_SELECTED_CURRENCY(val);
    },
  },
  computed: {
    ...mapGetters(["SELECTED_CURRENCY"]),
  },
  methods: {
    ...mapMutations(["CHANGE_SELECTED_CURRENCY"]),
  },
  mounted() {
    this.selectedCurrency = this.SELECTED_CURRENCY;
    // console.log(this.SELECTED_CURRENCY);
  },
};
</script>