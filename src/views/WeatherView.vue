<template>
  <div class="view-title">Погода</div>
  <div class="d-flex gap-2 mb-5">
    <InputTextComponent 
      :label="'Город, село и т.д.'" 
      :placeholder="'Введите название'"
      class="w-100"
      @inputEvent="inputEventHandler">
    </InputTextComponent>
    <ButtonComponent 
      :text="'Поиск'"
      @click="getWeather">
    </ButtonComponent> 
  </div>
  <div class="card">
    <div
      v-if="!isWeatherInfoLoaded"
      class="weather-not-found">
      <img src="@/assets/weather-not-found.png" >
      <span>Ничего не найдено</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import InputTextComponent from '@/components/UI/InputTextComponent.vue';
import ButtonComponent from '@/components/UI/ButtonComponent.vue';
import weatherService, { LocationInfo, WeatherInfo } from '@/services/weatherService';
import { useStore } from '@/store/store';

export default defineComponent({
  name: 'WeatherView',
  components: {
    InputTextComponent,
    ButtonComponent
  },
  setup() {
    const store = useStore();
    const isWeatherInfoLoaded = ref<boolean>(false);
    const locationInput = ref<string>("");
    const locationInfo = reactive<LocationInfo>(new LocationInfo());
    const weatherInfo = reactive({});

    const getWeather = async () => {
      if (locationInput.value.trim() === "") {
        return;
      }

      await store.dispatch("SHOW_PRELOADER_TRUE");

      try {
        weatherService.GetLocationInfoByName(locationInput.value)
          .then(response => {
            locationInfo.lat = response.data[0].lat;
            locationInfo.lon = response.data[0].lon;

            weatherService.GetWeatherByLocation(locationInfo)
              .then(async response => {


                isWeatherInfoLoaded.value = true;
                await store.dispatch("SHOW_PRELOADER_FALSE");
              })
              .catch(ex => {
                throw ex;
              })
          })
          .catch(ex => {
            throw ex;
          })
      } 
      catch (error) {
        isWeatherInfoLoaded.value = false;
        await store.dispatch("SHOW_PRELOADER_FALSE");
      }
    };

    const inputEventHandler = (inputValue: string) => {
      locationInput.value = inputValue;
    }

    return {
      isWeatherInfoLoaded,
      locationInput,
      getWeather,
      inputEventHandler
    }
  }
});
</script>

<style scoped>
.weather-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  opacity: 0.4;
}
.weather-not-found img {
  width: 256px;
  height: 256px;
} 
.weather-not-found span {
  font-weight: 700;
}
@media (max-width: 450px) {
  .weather-not-found img {
    width: 128px;
    height: 128px;
  }
}
</style>
