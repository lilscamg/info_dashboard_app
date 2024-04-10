<template>
<div class="preloader-container">
    <img src="@/assets/preloader/preloader.gif">
</div>
</template>    

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "PreloaderComponent"
})
</script>

<style>
.preloader-container{
    position: absolute;
    z-index: 100;
    background-color: white;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0.9;
}
.preloader-container img {
    width: 128px;
    height: 128px;
}
</style>