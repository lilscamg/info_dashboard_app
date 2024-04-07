<template>
    <nav class="desktop">
      <NavbarItemComponent :navItems="navItems"></NavbarItemComponent>
    </nav>
    <nav class="mobile" 
      :class="[!menuShow? 'hide':'']">
        <img 
          class="mb-2" 
          @click="hideMenu" 
          src="@/assets/hamburger.png"/>
        <NavbarItemComponent :navItems="navItems"></NavbarItemComponent>
    </nav>
</template>
  
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store/store';
import NavbarItemComponent from '@/components/NavbarItemComponent.vue'
import { navItems } from '@/shared/navPages';

export default defineComponent({
    name: 'NavbarComponent',
    components: {
      NavbarItemComponent,
    },
    setup() {
      const store = useStore();

      return {
        navItems,
        menuShow: computed(() => store.getters.getShowMenu),
        hideMenu: () => {
          store.dispatch(`NAVBAR_MENU_${store.getters.getShowMenu ? "HIDE" : "SHOW"}`);
        }
      }
    }
})
</script>

<style scoped>
nav {
  display: flex;
  gap: 10px;
  background-color: gainsboro;
  padding: var(--default-padding);
}
nav.desktop{
  flex-direction: row;
}
nav.mobile {
  flex-direction: column;
  display: none;
  height: 100vh;
}
nav img {
  width: 20px;
  height: 20px;
}
nav.mobile.hide {
  flex-basis: 50px;
}
@media (max-width: 450px) {
  nav.desktop {
    display: none !important;
  }
  nav.mobile {
    display: flex !important;
  }
}
</style>
  