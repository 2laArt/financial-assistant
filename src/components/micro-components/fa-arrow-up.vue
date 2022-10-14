<template>
  <div
    class="fa_arrow_up"
    @click="scroll"
  >
    UP
  </div>
</template>
<script>
export default {
  name: "fa-arrow-up",
  methods: {
    scroll() {
      window.scrollBy({
        top: -window.scrollY,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>
