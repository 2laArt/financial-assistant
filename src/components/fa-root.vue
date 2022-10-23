<template>
  <div class="fa_root">
    <fa-navigation />
    <fa-header />
    <div class="fa_root_container">
      <router-view />
    </div>

    <fa-arrow-up v-show="arrowUp" />
  </div>
</template>

<script>
import FaNavigation from "./fa-navigation/fa-navigation.vue";
import FaHeader from "./fa-navigation/fa-header.vue";
import FaArrowUp from "./micro-components/fa-arrow-up.vue";
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "Fa-root",
  components: {
    FaNavigation,
    FaArrowUp,
    FaHeader,
  },
  data() {
    return {
      arrowUp: false,
    };
  },
  created() {
    this.beginningWork();
    document.body.style.overflow = "hidden";
  },
  watch: {
    SELECTED_CURRENCY() {
      this.IS_LOADED_PAGE(false);
      this.setPriceToCurrencies();
    },
    LOADED_PAGE(val) {
      if (val) {
        document.body.style.overflow = "scroll";
      } else document.body.style.overflow = "hidden";
    },
  },
  computed: {
    ...mapGetters(["SELECTED_CURRENCY", "LOADED_PAGE"]),
  },
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
    async getLists() {
      await this.GET_LIST_ALL_CURRENCIES_FROM_API();
      await this.GET_LIST_ALL_CRYPTO_FROM_API();
    },
    async setPriceToCurrencies() {
      await this.GET_PRICES_FOR_CURRENCY_FROM_API(this.SELECTED_CURRENCY);
      this.ADD_PRICES_TO_CURRENCIES();
      this.ADD_PRICES_TO_CRYPTO();
      this.IS_LOADED_PAGE(true);
    },
    async beginningWork() {
      await this.getLists();
      await this.setPriceToCurrencies();
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