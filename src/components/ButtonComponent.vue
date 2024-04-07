<template>
    <button>{{ text }}</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: "InputComponent",
    props: {
        text: {
            type: String as PropType<string>,
            required: false,
        }
    }
});
</script>

<style scoped>
button {
    background-color: var(--main-color);
    border: none;
    border-radius: 15px;
    padding: 0 15px;
    color: white;
}
</style>