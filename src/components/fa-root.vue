<template>
  <div class="fa_root">
    <fa-navigation />
    <router-view />
  </div>
</template>

<script>
import faNavigation from "./fa-navigation/fa-navigation.vue";
import { mapActions } from "vuex";
export default {
  name: "Fa-root",
  components: {
    faNavigation,
  },
  data() {
    return {};
  },
  created() {
    this.GET_PRICES_FOR_CURRENCY_FROM_API("USD");
  },
  computed: {},
  methods: {
    ...mapActions(["GET_PRICES_FOR_CURRENCY_FROM_API"]),
  },
  mounted() {},
};
</script>