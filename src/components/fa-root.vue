<template>
  <div class="fa_root">
    <fa-navigation />
    <fa-top-panel />

    <router-view />

    <fa-arrow-up v-show="arrowUp" />
  </div>
</template>

<script>
import FaNavigation from "./fa-navigation/fa-navigation.vue";
import FaTopPanel from "./fa-navigation/fa-top-panel.vue";
import FaArrowUp from "./micro-components/fa-arrow-up.vue";
import { mapActions, mapMutations } from "vuex";
export default {
  name: "Fa-root",
  components: {
    FaNavigation,
    FaArrowUp,
    FaTopPanel,
  },
  data() {
    return {
      curCur: "USD",
      arrowUp: false,
    };
  },
  created() {
    // bad bad bad //
    (async () => {
      await this.GET_PRICES_FOR_CURRENCY_FROM_API(this.curCur);
      await this.GET_LIST_ALL_CURRENCIES_FROM_API();
      await this.GET_LIST_ALL_CRYPTO_FROM_API();
      await this.ADD_PRICES_TO_CURRENCIES();
      await this.ADD_PRICES_TO_CRYPTO();
      await this.IS_LOADED_PAGE();
    })();
  },
  computed: {},
  methods: {
    ...mapActions([
      "GET_PRICES_FOR_CURRENCY_FROM_API",
      "GET_LIST_ALL_CURRENCIES_FROM_API",
      "GET_LIST_ALL_CRYPTO_FROM_API",
    ]),
    ...mapMutations([
      "ADD_PRICES_TO_CURRENCIES",
      "ADD_PRICES_TO_CRYPTO",
      "IS_LOADED_PAGE",
    ]),
    displayArrowUp() {
      if (window.innerHeight < window.scrollY) {
        this.arrowUp = true;
      } else this.arrowUp = false;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.displayArrowUp);
  },
  unmounted() {
    window.removeEventListener("scroll", this.displayArrowUp);
  },
};
</script>