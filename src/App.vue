<template>
  <div class="app-container">
    <NavbarComponent></NavbarComponent>
    <div class="view-layout"><router-view/></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import NavbarComponent from '@/components/NavbarComponent.vue'
import { useStore } from './store/store';

export default defineComponent({
    name: 'App',
    components: {    
      NavbarComponent
    },
    setup() {
      const store = useStore();
      const windowWidth = ref(window.innerWidth);
      watch (windowWidth, (newValue, oldValue) => {
        const isMobile = windowWidth.value <= 450;
        store.dispatch(`SET_IS_MOBILE_${isMobile ? 'TRUE' : 'FALSE'}`);
      });

      const widthResizeHandler = () => {
        windowWidth.value = window.innerWidth;
      };
      onMounted(() => {
        window.addEventListener("resize", widthResizeHandler);
      });
      onUnmounted(() => {
        window.removeEventListener("resize", widthResizeHandler);
      });
    }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

:root{
  --default-padding: 20px;
}
body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-style: normal;
}
.app-container {
  display: flex;
  flex-direction: column;
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
