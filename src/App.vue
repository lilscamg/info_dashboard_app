<template>
  <PreloaderComponent v-if="showPreloader"></PreloaderComponent>
  <NavbarComponent></NavbarComponent>
  <div 
    class="view-layout"
    :class="{'view-layout-margin': isSetMarginToViewLayout}">
      <router-view/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import NavbarComponent from '@/components/NavbarComponent.vue';
import PreloaderComponent from '@/components/PreloaderComponent.vue';
import { useStore } from './store/store';

export default defineComponent({
    name: 'App',
    components: {    
      NavbarComponent,
      PreloaderComponent
    },
    setup() {
      const store = useStore();
      const windowWidth = ref<number>(window.innerWidth);
      const showPreloader = computed<boolean>(() => store.getters.getShowPreloader);
      const isSetMarginToViewLayout = computed<boolean>(() => store.getters.getShowMenu && store.getters.getIsMobile)

      watch (windowWidth, (newValue, oldValue) => {
        const isMobile = windowWidth.value <= 450;
        store.dispatch(`SET_IS_MOBILE_${isMobile ? 'TRUE' : 'FALSE'}`);
      });
      const widthResizeHandler = () => {
        windowWidth.value = window.innerWidth;
      };
      onMounted(() => {
        const isMobile = windowWidth.value <= 450;
        store.dispatch(`SET_IS_MOBILE_${isMobile ? 'TRUE' : 'FALSE'}`);
        window.addEventListener("resize", widthResizeHandler);
      });
      onUnmounted(() => {
        window.removeEventListener("resize", widthResizeHandler);
      });

      return {
        showPreloader,
        isSetMarginToViewLayout
      }
    }
})
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: auto;
}
.view-layout {
  padding: var(--default-offset);
  flex-grow: 1;
  height: auto;
}
@media (max-width: 450px) {
  /* ломается здесь */
  /* #app {
    flex-direction: row !important;
  } */
  .view-layout {
    margin-left: 60px;
  }  
}
</style>
