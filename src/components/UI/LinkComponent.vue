<template>
    <a :href="href">{{ text }}</a>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: "LinkComponent",
    props: {
        text: {
            type: String as PropType<string>,
            required: true,
        },
        href: {
            type: String as PropType<string>,
            required: true
        }
    }
});
</script>

<style scoped>
a {
    text-decoration: none;
    color: white;
}
</style>