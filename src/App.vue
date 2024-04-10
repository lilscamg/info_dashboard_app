<template>
  <div class="app-container">
    <PreloaderComponent v-if="store.getters.getShowPreloader"></PreloaderComponent>
    <NavbarComponent></NavbarComponent>
    <div class="view-layout"><router-view/></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
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
        store
      }
    }
})
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
}
.view-layout {
  padding: var(--default-padding);
  flex-grow: 1;
}
@media (max-width: 450px) {
  .app-container {
    flex-direction: row !important;
  }
}
</style>
