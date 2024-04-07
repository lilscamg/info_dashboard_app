<template>
  <div class="view-title">Погода</div>
  <div class="d-flex gap-2">
    <InputTextComponent 
      :label="'Город, населенный пункт и т.д.'" 
      :placeholder="'Введите название'"
      class="w-100">
    </InputTextComponent>
    <ButtonComponent 
      :text="'Поиск'"
      @click="findObject">
    </ButtonComponent> 
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import weatherService from '@/services/weatherService';
import InputTextComponent from '@/components/InputTextComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';


export default defineComponent({
  name: 'WeatherView',
  components: {
    InputTextComponent,
    ButtonComponent
  },
  setup() {
    const findObject = () => {
      try {
        axios.get('https://jsonplaceholder.typicode.com/todos/1')
          .then((response) => {
            alert(response.data.id);
          })
          .catch(error => {
            throw error;
          })

      } catch (error) {
        console.log(error);
      }
    }

    return {
      findObject
    }
  }
});
</script>

<style scoped> 
</style>
