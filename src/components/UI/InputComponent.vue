<template>
    <div class="input_text_container">
        <label v-if="label">{{ label }}</label>
        <input
            :type="type"
            v-model="inputValue" 
            :placeholder="placeholder"
            :disabled="disabled"
            @input="$emit('inputEvent', inputValue)">
    </div> 
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
    name: "InputComponent",
    props: {
        type: {
            type: String as PropType<string>,
            required: false,
            default: 'text'
        },
        label: {
            type: String as PropType<string>,
            required: false,
        },
        placeholder: {
            type: String as PropType<string>,
            required: false,
        },
        disabled: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        },
        value: {
            type: [String, Number],
            required: false,
        }
    },
    setup(props) {
        const inputValue = ref<string | number | undefined>(props.value);
        const changeValue = (value: string | number) => {
            inputValue.value = value;
        }
        return {
            inputValue,
            changeValue
        }
    }
});
</script>

<style scoped>
.input_text_container {
    position: relative;
}
input {
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
    font-size: var(--fs-sm);
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