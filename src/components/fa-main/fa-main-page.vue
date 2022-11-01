<template>
  <div class="fa_main">
    <h3 class="fa_main_sub_title">
      Welcome
    </h3>
    <h2 class="fa_main_title">
      This is Your Financial Assistant
    </h2>

    <article class="posts_collection">
      <section class="big_post post_item">
        <img
          class="post_image"
          src="../../assets/images/main-page-img/bisness.jpg"
          alt="bisness"
        >
        <div class="post_text">
          <p> First of all, we would like to present you the crypto-parent of the contemporary financial conception – the blockchain.</p>
        </div>
      </section>
      <section class="small_posts">

        <div class="small_item post_item">
          <img
            class="post_image"
            src="../../assets/images/main-page-img/graphGold.jpg"
            alt="img post"
          >
          <div class="post_text">
            <p>A public ledger, recording chronologically and publicly pieces of information.</p>
          </div>
        </div>

        <div
          class="small_item post_item"
          :style="{
          'background': background(Math.floor(Math.random() * 360 + 1))
           }"
        >
          <div class="post_text">
            <p>All the data is separated and stored in blocks.</p>
          </div>
        </div>

        <div
          class="small_item post_item"
          :style="{
          'background': background(Math.floor(Math.random() * 360 + 1))
           }"
        >
          <div class="post_text">
            <p>In crypto, it is an open history database of all the financial transactions in the network.</p>
          </div>
        </div>

        <div class="small_item post_item">
          <img
            class="post_image"
            src="../../assets/images/main-page-img/crypto.jpg"
            alt="img post"
          >
          <div class="post_text">
            <p>When the block's size is filled, there's a new one generated, which grows the blockchain.</p>
          </div>
        </div>

      </section>
    </article>

    <section class="post_section">
      <h4 class="post_title">
        NFT Marketplace
      </h4>
      <div class="post_content">
        <div class="post_image_wrapper">
          <div class="post_image_bg post_image_bg-1"></div>
          <div class="post_image_bg post_image_bg-2"></div>
        </div>
        <div class="test_text">
          You can create your own unique tokens. Shares creativity. Support for artists and creators.
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "main-page",
  data() {
    return {
      posts: {
        post1: [
          {
            bg: "../../assets/images/main-page-img/graphGold.jpg",
            text: "A public ledger, recording chronologically and publicly pieces of information.",
          },
          {
            bg: null,
            text: "All the data is separated and stored in blocks.",
          },
          {
            bg: "../../assets/images/main-page-img/crypto.jpg",
            text: "When the block's size is filled, there's a new one generated, which grows the blockchain.",
          },
          {
            bg: null,
            text: "In crypto, it is an open history database of all the financial transactions in the network.",
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    background(val) {
      return `hsl(${val},100%,30%)`;
    },
  },
};
</script>