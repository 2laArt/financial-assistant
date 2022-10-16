<template>
  <div class="fa_currency">
    <fa-table
      v-if="LOADED_PAGE"
      :titleTable="titleTable"
      :headersColum="headersColum"
      :infoCurrencies="CURRENCIES"
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
      titleTable: "Table of all fiat currencies to",
      headersColum: ["Marker", "Full Title", "Price"],
    };
  },
  computed: {
    ...mapGetters(["CURRENCIES", "LOADED_PAGE"]),
  },
  methods: {},
};
</script>