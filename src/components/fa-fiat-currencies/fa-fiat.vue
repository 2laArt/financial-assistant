<template>
  <div class="fa_currency">
    <fa-table
      :infoCurrencies="currencies"
      :titleTable="titleTable"
      :headersColum="headersColum"
      :selectedFiat="selectedFiat"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FaTable from "../repeating-components/table/fa-table.vue";

export default {
  name: "fa-currency",
  components: {
    FaTable,
  },
  data() {
    return {
      selectedFiat: "USD",
      titleTable: "Table of all currencies to",
      headersColum: ["Marker", "Full Title", "Price"],
    };
  },
  created() {},
  mounted() {},
  ummount() {},
  beforeUnmount() {},
  watch: {},
  computed: {
    ...mapGetters({
      currencies: "CURRENCIES",
    }),
  },
  methods: {},
};
</script>