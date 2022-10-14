<template>
  <div class="fa_app">
    <fa-loader v-if="!LOADED_PAGE" />
    <fa-root />
  </div>
</template>

<script>
import FaRoot from "./components/fa-root.vue";
import FaLoader from "./components/micro-components/fa-loader.vue";
import { mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    FaRoot,
    FaLoader,
  },
  computed: {
    ...mapGetters(["LOADED_PAGE"]),
  },
};
</script>
