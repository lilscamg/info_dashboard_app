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
            <ButtonComponent
                v-if="modalRefObj.text && modalRefObj.link" 
                :text="modalRefObj.text" 
                @click="goToModalRef(modalRefObj.link)">
            </ButtonComponent>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue';
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
        const modalRefObj = reactive<any | null>({ link: null, text: null});
        const isDetailedErrorInfoShown = ref<boolean>(false);

        const showModal = (
            isShown: boolean, 
            title = "", 
            text = "", 
            error : string | null = null,
            refObj : any | null = null) => 
        {
            if (isShown) {
                modalText.value = text;
                modalTitle.value = title;
                modalError.value = error;
                modalRefObj.link = refObj ? refObj.link : null;
                modalRefObj.text = refObj ? refObj.text : null;
            }
            else {
                modalText.value = "";
                modalTitle.value = "";
                modalError.value = null;
                modalRefObj.link = null;
                modalRefObj.text = null;
                isDetailedErrorInfoShown.value = false;
            }
            isModalShown.value = isShown;
        }
        const showDetailedError = () => {
            isDetailedErrorInfoShown.value = !isDetailedErrorInfoShown.value;
        }
        const goToModalRef = (link: string) => {
            window.open(link, "_blank");
        }
        return {
            isModalShown,
            modalText,
            modalTitle,
            modalError,
            modalRefObj,
            isDetailedErrorInfoShown,
            showModal,
            showDetailedError,
            goToModalRef
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
    padding: var(--default-offset);
    background: white;
    border-radius: var(--default-border-radius);
    min-width: 350px;
    max-width: 365px;
    width: auto;
    display: flex;
    flex-direction: column;
}
.modal-title {
    color: var(--main-color);
    font-size: var(--fs-lg);
    font-weight: 700;
    text-align: center;
    margin-bottom: var(--default-offset);
}
.modal-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: var(--fs-md);
    /* text-align: center; */
    flex-grow: 1;
    margin-bottom: var(--default-offset);
}
.modal-error {
    margin-bottom: var(--default-offset);
}
.modal-error-detailed {
    display: inline-flex;
    cursor: pointer;
}
.modal-error-text {
    color: var(--red-color);
    font-size: var(--fs-sm);
}
.modal-buttons {
    display: flex;
    justify-content: space-evenly;
}
</style>