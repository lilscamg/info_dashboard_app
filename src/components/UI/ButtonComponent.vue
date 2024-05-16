<template>
    <button>{{ text }}</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: "ButtonComponent",
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
    border-radius: var(--default-border-radius);
    padding: 5px 15px;
    color: white;
}
button:hover{
    background-color: var(--secondary-color);
}
</style>