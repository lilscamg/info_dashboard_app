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
    <div 
      v-else
      class="d-flex flex-column">
        <div
          class="weather-location">
            <span>Прогноз на {{ new Date(currentWeatherInfo.dt * 1000).toLocaleString() }} для:</span><br>
            <span class="c-main text-bold">
              {{ locationInfo.local_names ? locationInfo.local_names[lang] : locationInfo.name }},
              {{ locationInfo.state !== locationInfo.name ? locationInfo.state : "" }}
            </span>
        </div>
        <div class="weather-desc d-flex flex-sm-row flex-column align-items-sm-center">
            <div class="me-3">
              <img 
                :src="currentWeatherInfo.weatherIcon" alt=""
                class="me-2">
              <span class="c-main">{{ currentWeatherInfo.temp }}°</span>
            </div>
            <span>{{ currentWeatherInfo.weatherDescription }}</span>
        </div>
        <hr>
        <div class="weather-option">
          <span>Основное</span>
          <div class="row">
            <span class="col-12 col-sm-auto">Ощущается как:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.feels_like }}°</span>
          </div>
          <div 
            v-if="currentWeatherInfo.temp_min && currentWeatherInfo.temp_max" 
            class="row">
              <div class="col-12 col-sm-6 col-md-4">
                <div class="row">
                  <span class="col-12">{{isMobile? 'Мин. температура' : 'Минимальная температура'}}:</span>
                  <span class="col-12 c-main text-bold">{{currentWeatherInfo.temp_min}}°</span>
                </div>
              </div>
              <div class="col-12 col-sm-6 col-md-8">
                <div class="row">
                  <span class="col-12">{{isMobile? 'Макс. температура' : 'Минимальная температура'}}:</span>
                  <span class="col-12 c-main text-bold">{{currentWeatherInfo.temp_max}}°</span>
                </div>
              </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6 col-md-4">
              <div class="row">
                <span class="col-12">Влажность:</span>
                <span class="col-12 c-main text-bold">{{currentWeatherInfo.humidity}} %</span>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-8">
              <div class="row">
                <span class="col-12">Давление:</span>
                <span class="col-12 c-main text-bold">{{currentWeatherInfo.pressure}} гПа</span>
              </div>
            </div>
          </div>
          <div class="row">
            <span class="col-12 col-sm-auto">Видимость:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.visibility }} м</span>
          </div>
        </div>
        <hr>
        <div class="weather-option">
          <span>Ветер</span>
        </div>
        <hr>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import InputTextComponent from '@/components/UI/InputTextComponent.vue';
import ButtonComponent from '@/components/UI/ButtonComponent.vue';
import weatherService, { LocationInfo, CurrentWeatherInfo } from '@/services/weatherService';
import { useStore } from '@/store/store';

export default defineComponent({
  name: 'WeatherView',
  components: {
    InputTextComponent,
    ButtonComponent
  },

  setup() {
    const store = useStore();
    const isMobile = computed<boolean>(() => store.getters.getIsMobile);
    const lang = computed<any>(() => store.getters.getLang);
    const isWeatherInfoLoaded = ref<boolean>(false);
    const locationInput = ref<string>("Казань");
    let locationInfo = reactive<LocationInfo>(new LocationInfo());
    let currentWeatherInfo = reactive<CurrentWeatherInfo>(new CurrentWeatherInfo());

    const getWeather = async () => {
      if (locationInput.value.trim() === "") {
        isWeatherInfoLoaded.value = false;
        return;
      }
      
      await store.dispatch("SHOW_PRELOADER_TRUE");
      try {
        weatherService.GetLocationInfoByName(locationInput.value)
          .then(response => {
            locationInfo.Update(response.data[0]);
            weatherService.GetCurrentWeatherByLocation(locationInfo)
              .then(async response => {
                currentWeatherInfo.Update(
                  response.data.weather[0],
                  response.data.main,
                  response.data.wind,
                  response.data.clouds,
                  response.data.visibility,
                  response.data.rain,
                  response.data.snow,
                  response.data.name,
                  response.data.dt
                );
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
      lang,
      isMobile,
      isWeatherInfoLoaded,
      locationInput,
      locationInfo,
      currentWeatherInfo,
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
.weather-location {
  font-size: 20px;
  line-height: 1;
  margin-bottom: 20px;
}
.weather-desc {
  text-transform: uppercase;
  font-size: 24px;
  font-weight: 700;
}
.weather-option > span{
  font-size: 24px;
  font-weight: 700;
}
@media (max-width: 450px) {
  .weather-not-found img {
    width: 128px;
    height: 128px;
  }
  .weather-desc {
    font-size: 20px;
  }
}
</style>
