
<template>
  <div class="fa_welcome">
    <h1 class="welcom_title_main">
      This is Your Financial Assistant
    </h1>
    <div class="fa_welcom_container">
      <div class="welcome_text welcome_item">
        <h5 class="title_welcome">
          We are glad to welcome you on this site.
        </h5>
        <h3 class="title_welcome_main_info">
          Financial Assistant is <mark>not a commercial</mark> project that provides free access to <mark>information</mark> and analytics.
        </h3>
        <ul class="feature_list">
          <li
            class="feature_item"
            v-for="(item, i) in featureList"
            :key="item"
            @click="selectedImg = i+1"
          >
            {{item}}
          </li>
        </ul>
      </div>
      <div class="welcom_image welcome_item">
        <img
          :src="require( `../../assets/images/welcome/${selectedImg}.png`)"
          alt="img"
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "fa-welcome",
  data() {
    return {
      featureList: [
        "basic concepts of the financial world",
        "prices of cryptocurrencies in relation to the selected currency",
        "the ratio of world currencies to each other",
        "graph of cryptocurrencies price dynamics",
      ],
      selectedImg: 1,
    };
  },
  computed: {
    selectItem() {
      return `../../assets/images/welcome/${this.selectedImg}.png`;
    },
  },
};
</script>