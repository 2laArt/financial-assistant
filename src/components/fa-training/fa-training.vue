<template>
  <div class="fa_training">training</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "fa-training",
  data() {
    return { curpair: "BTC-USD" };
  },
  created() {
    const pair = this.curpair;
    const dateNow = new Date(Date.now());
    const datePast = new Date(Date.now() - 36e5 * 3);
    const dateStart = this.createDateString(datePast);
    const dateEnd = this.createDateString(dateNow);
    console.log(dateStart);
    console.log(dateEnd);
    this.GET_CANDLES_TO_CURRENCY_PAIR_FROM_API({ pair, dateStart, dateEnd });
  },
  computed: {
    ...mapGetters(["CANDLES"]),
  },
  methods: {
    ...mapActions(["GET_CANDLES_TO_CURRENCY_PAIR_FROM_API"]),
    createDateString(date) {
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:00`;
    },
  },
};
</script>