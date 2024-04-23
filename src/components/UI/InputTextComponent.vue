<template>
    <div class="input_text_container">
        <label v-if="label">{{ label }}</label>
        <input type="text" 
            v-model="inputValue" 
            :placeholder="placeholder"
            @input="$emit('inputEvent', inputValue)">
    </div> 
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
    name: "ButtonComponent",
    props: {
        label: {
            type: String as PropType<string>,
            required: false,
        },
        placeholder: {
            type: String as PropType<string>,
            required: false,
        }
    },
    setup() {
        const inputValue = ref<string>("");
        return {
            inputValue
        }
    }
});
</script>

<style scoped>
.input_text_container {
    position: relative;
}
input[type='text'] {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid var(--main-color);
    border-radius: var(--default-border-radius);
    z-index: 1;
}
input:focus {
    border: 1px solid var(--secondary-color);
}
label {
    position: absolute;
    font-size: 12px;
    background-color: white;
    z-index: 30;
    left: 15px;
    top: -6px;
    padding: 0 5px;
    color: var(--main-color);
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>