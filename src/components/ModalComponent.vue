<template>
<div 
    class="modal-container" 
    v-show="isModalShown"
    @click.stop="showModal(false)">
    <div 
        class="modal-content"
        @click.stop>
        <div class="modal-title">{{ modalTitle }}</div>
        <div class="modal-text">
            <span>{{ modalText }}</span>
        </div>
        <div class="modal-error" v-if="modalError">
            <div class="modal-error-detailed" @click="showDetailedError">
                <div class="me-2">Подробнее</div>
                <img 
                    src="@/assets/icons/down-arrow.png" alt=""
                    :style="{transform: `rotate(${isDetailedErrorInfoShown ? 180 : 0}deg)`}">
            </div>
            <div
                v-show="isDetailedErrorInfoShown" 
                class="modal-error-text">
                {{ modalError }}
            </div>
        </div>
        <div class="modal-buttons">
            <ButtonComponent 
                :text="'Закрыть'" 
                @click="showModal(false)">
            </ButtonComponent>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ButtonComponent from './UI/ButtonComponent.vue';

export default defineComponent({
    name: "ModalComponent",
    components: {
        ButtonComponent
    },
    setup() {
        const isModalShown = ref<boolean>(false);
        const modalText = ref<string>("");
        const modalTitle = ref<string>("");
        const modalError = ref<string | null>(null);
        const isDetailedErrorInfoShown = ref<boolean>(false);
        const showModal = (isShown: boolean, title = "", text = "", error : string | null = null) => {
            if (isShown) {
                modalText.value = text;
                modalTitle.value = title;
                modalError.value = error;
            }
            else {
                modalText.value = "";
                modalTitle.value = "";
                modalError.value = null;
                isDetailedErrorInfoShown.value = false;
            }
            isModalShown.value = isShown;
        }
        const showDetailedError = () => {
            isDetailedErrorInfoShown.value = !isDetailedErrorInfoShown.value;
        }
        return {
            isModalShown,
            modalText,
            modalTitle,
            modalError,
            isDetailedErrorInfoShown,
            showModal,
            showDetailedError
        }
    }
});
</script>

<style scoped>
.modal-container {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
    z-index: 100;
}
.modal-content {
    margin: auto;
    padding: var(--default-padding);
    background: white;
    border-radius: var(--default-border-radius);
    width: 350px;
    display: flex;
    flex-direction: column;
}
.modal-title {
    color: var(--main-color);
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
}
.modal-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 18px;
    text-align: center;
    flex-grow: 1;
    margin-bottom: 20px;
}
.modal-error {
    margin-bottom: 20px;
}
.modal-error-detailed {
    display: inline-flex;
    cursor: pointer;
    color: var(--gray-color);
}
.modal-error-text {
    color: var(--red-color);
}
.modal-buttons {
    display: flex;
    justify-content: space-around;
}
</style>