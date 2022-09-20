<template>
  <div
    class="fa_navigation"
    :class="{fa_navigation_hover:isHoverOnMenu}"
    @mouseenter="isHoverOnMenu = true"
    @mouseleave="isHoverOnMenu = false"
  >
    <nav class="fa_nav">
      <ul class="fa_nav_list">
        <li
          class="fa_nav_item"
          v-for=" item in $options.navigation"
          :key="item"
          :class="{fa_nav_item_active:item.title===isActive}"
          @click="isActive=item.title"
        >
          <router-link :to="{name:item.title}">
            <div class="fa_nav_item_content">
              <span class="fa_nav_wrapper_icon">
                <component :is="item.icon" />
              </span>
              <span class="fa_nav_title">
                {{item.title}}
              </span>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import iconHome from "./fa-nav-icon/fa-nav-icon-home.vue";
import iconCrypto from "./fa-nav-icon/fa-nav-icon-crypto.vue";
import iconCurrency from "./fa-nav-icon/fa-nav-icon-currency.vue";
import iconTraining from "./fa-nav-icon/fa-nav-icon-training.vue";
export default {
  name: "fa-navigation",
  navigation: [
    { title: "main", icon: iconHome },
    { title: "crypto", icon: iconCrypto },
    { title: "currency", icon: iconCurrency },
    { title: "training", icon: iconTraining },
  ],
  data() {
    return {
      isActive: this.$route.name,
      isHoverOnMenu: false,
    };
  },
  mounted() {},
  watch: {
    $route() {
      this.isActive = this.$route.name;
    },
  },
  methods: {},
};
</script>