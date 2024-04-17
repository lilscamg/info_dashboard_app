<template>
    <nav class="desktop">
      <img src="@/assets/logo/logo32.png" class="nav-logo" alt="">
      <div class="nav-title">InfoDashboard</div>
      <NavbarItemComponent
        v-for="item in navItems" 
        :navItem="item"
        :key="item.id">
      </NavbarItemComponent>
      <div class="d-flex justify-content-end flex-grow-1">
        <LinkComponent
          :text="'Вход'"
          :href="'/auth'">
        </LinkComponent>
      </div>
    </nav>
    <nav class="mobile" 
      :class="[!menuShow? 'hide':'']">
        <img 
          class="mb-2" 
          @click="hideMenu" 
          src="@/assets/icons/hamburger.png"/>
        <NavbarItemComponent
          v-for="item in navItems" 
          :navItem="item"
          :key="item.id">
        </NavbarItemComponent>
    </nav>
</template>
  
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store/store';
import NavbarItemComponent from '@/components/NavbarItemComponent.vue'
import LinkComponent from './UI/LinkComponent.vue';
import { navItems } from '@/shared/navPages';

export default defineComponent({
    name: 'NavbarComponent',
    components: {
      NavbarItemComponent,
      LinkComponent
    },
    setup() {
      const store = useStore();

      return {
        navItems,
        menuShow: computed<boolean>(() => store.getters.getShowMenu),
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
  background-color: var(--main-color);
  padding: var(--default-padding);
  z-index: 40;
}
nav.desktop{
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
nav.mobile {
  flex-direction: column;
  display: none;
  gap: 15px;
  position: absolute;
  height: 100%;
}
nav img:not(.nav-logo) {
  width: 20px;
  height: 20px;
}
nav.mobile.hide {
  flex-basis: 50px;
  position: sticky;
}
.nav-title {
  font-size: 24px;
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
  