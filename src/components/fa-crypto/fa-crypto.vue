<template>
  <div class="fa_cripto">
    <fa-table
      v-if="LOADED_PAGE"
      :titleTable="titleTable"
      :headersColum="headersColum"
      :selectedFiat="selectedFiat"
      :infoCurrencies="CRYPTO"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FaTable from "../repeating-components/table/fa-table.vue";
export default {
  name: "fa-crypto",
  components: {
    FaTable,
  },
  data() {
    return {
      selectedFiat: "USD",
      titleTable: "Crypto",
      headersColum: ["marker", "full name", "price"],
    };
  },
  computed: {
    ...mapGetters(["CRYPTO", "LOADED_PAGE"]),
  },
};
</script>
