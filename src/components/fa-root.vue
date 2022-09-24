<template>
  <div class="fa_root">
    <fa-navigation />
    <router-view />
  </div>
</template>

<script>
import faNavigation from "./fa-navigation/fa-navigation.vue";
import { mapActions, mapMutations } from "vuex";
export default {
  name: "Fa-root",
  components: {
    faNavigation,
  },
  data() {
    return {
      curCur: "USD",
    };
  },
  created() {
    (async () => {
      await this.GET_PRICES_FOR_CURRENCY_FROM_API(this.curCur);
      await this.GET_LIST_ALL_CURRENCIES_FROM_API();
      await this.GET_LIST_ALL_CRYPTO_FROM_API();
      await this.ADD_PRICES_TO_CURRENCIES();
    })();
  },
  computed: {},
  methods: {
    ...mapActions([
      "GET_PRICES_FOR_CURRENCY_FROM_API",
      "GET_LIST_ALL_CURRENCIES_FROM_API",
      "GET_LIST_ALL_CRYPTO_FROM_API",
    ]),
    ...mapMutations(["ADD_PRICES_TO_CURRENCIES"]),
  },
  mounted() {},
};
</script>