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
      class="weather-not-found" 
      v-if="!isWeatherInfoLoaded">
      <img src="@/assets/weather-not-found.png" >
      <span>Ничего не найдено</span>
    </div>
    <div 
      class="d-flex flex-column" 
      v-else>
      <!-- Время и локация -->
      <div class="weather-location">
        <span>Прогноз на {{ new Date(currentWeatherInfo.dt * 1000).toLocaleString() }} для:</span><br>
        <span class="c-main text-bold">
          {{ locationInfo.local_names ? locationInfo.local_names[lang] : locationInfo.name }},
          {{ locationInfo.state !== locationInfo.name ? locationInfo.state : "" }}
        </span>
      </div>
      <!-- Описание погоды -->
      <div class="weather-desc d-flex flex-sm-row flex-column align-items-sm-center">
        <div class="me-3">
          <img class="me-2" :src="currentWeatherInfo.weatherIcon" alt="">
          <span class="c-main">{{ currentWeatherInfo.temp }}°</span>
        </div>
        <span>{{ currentWeatherInfo.weatherDescription }}</span>
      </div>
      <hr>
      <!-- Основная информация -->
      <div class="weather-options row">
        <!-- Температура -->
        <div class="weather-option col-12 col-sm-auto">
          <div class="row mb-2">
            <span class="col-auto weather-option-title">Температура</span>
            <div class="col">
              <img src="@/assets/icons/thermometer.png" alt="">
            </div>
          </div>
          <div class="row">
            <span class="col-12 col-sm-auto">Ощущается как:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.feels_like }}°</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.temp_min">
            <span class="col-12 col-sm-auto">Мин. температура:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.temp_min }}°</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.temp_max">
            <span class="col-12 col-sm-auto">Макс. температура:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.temp_max }}°</span>
          </div>
        </div>
        <hr>
        <!-- Ветер -->
        <div class="weather-option col-12 col-sm-auto">
          <div class="row mb-2">
            <span class="col-auto weather-option-title">Ветер</span>
            <div class="col">
              <img src="@/assets/icons/wind.png" alt="">
            </div>
          </div>
          <div class="row">
            <span class="col-12 col-sm-auto">Скорость ветра:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.windSpeed }} м/с</span>
          </div>
          <div class="row">
            <span class="col-12 col-sm-auto">Направление:</span>
            <div class="col-12 col-sm c-main text-bold">
              <img 
                src="@/assets/icons/up-arrow.png"
                :style="{transform: `rotate(${currentWeatherInfo.windDeg}deg)`}" 
                alt="">
            </div>
          </div>
          <div class="row" v-if="currentWeatherInfo.windGust">
            <span class="col-12 col-sm-auto">Порыв ветра:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.windGust }} м/с</span>
          </div>
        </div>
        <hr>
        <!-- Осадки -->
        <div class="weather-option col-12 col-sm-auto">
          <div class="row mb-2">
            <span class="col-auto weather-option-title">Осадки</span>
            <div class="col">
              <img src="@/assets/icons/rain.png" alt="">
            </div>
          </div>
          <div class="row"
            v-if="!currentWeatherInfo.rain1h
            && !currentWeatherInfo.rain3h
            && !currentWeatherInfo.snow1h
            && !currentWeatherInfo.snow3h">
            <div class="col">Нет информации</div>
          </div>
          <div class="row" v-if="currentWeatherInfo.rain1h">
            <span class="col-12 col-sm-auto">Дождь (посл. 1 час):</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.rain1h }} мм</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.rain3h">
            <span class="col-12 col-sm-auto">Дождь (посл. 3 часа):</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.rain3h }} мм</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.snow1h">
            <span class="col-12 col-sm-auto">Снег (посл. 1 час):</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.snow1h }} мм</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.snow3h">
            <span class="col-12 col-sm-auto">Снег (посл. 3 часа):</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.snow3h }} мм</span>
          </div>
        </div>
        <hr>
        <!-- Остальное -->
        <div class="weather-option col-12 col-sm-auto">
          <div class="row mb-2">
            <span class="col-auto weather-option-title">Остальное</span>
            <div class="col">
              <img src="@/assets/icons/information.png" alt="">
            </div>
          </div>
          <div class="row">
            <span class="col-12 col-sm-auto">Влажность:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.humidity }} %</span>
          </div>
          <div class="row">
            <span class="col-12 col-sm-auto">Давление:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.pressure }} гПа</span>
          </div>
          <div class="row">
            <span class="col-12 col-sm-auto">Видимость:</span>
            <span class="col-12 col-sm c-main text-bold">{{ currentWeatherInfo.visibility }} м</span>
          </div>
        </div>
      </div>
      <hr>
      <!-- Прогноз на несколько дней -->
      <div class="row">
        <div class="col-12 weather-forecast-title">Информация на 5 дней</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
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

    // to do: убрать
    onMounted(async () => {
      await getWeather();
    }) 

    const getWeather = async () => {
      if (locationInput.value.trim() === "") {
        isWeatherInfoLoaded.value = false;
        alert("Ничего не введено")
        return;
      }
      
      await store.dispatch("SHOW_PRELOADER_TRUE");

      try {
        const locationResponse = await weatherService.GetLocationInfoByName(locationInput.value);
        locationInfo.Update(locationResponse.data[0]);

        const weatherResponse = await weatherService.GetCurrentWeatherByLocation(locationInfo);
        currentWeatherInfo.Update(
          weatherResponse.data.weather[0],
          weatherResponse.data.main,
          weatherResponse.data.wind,
          weatherResponse.data.clouds,
          weatherResponse.data.visibility,
          weatherResponse.data.rain,
          weatherResponse.data.snow,
          weatherResponse.data.name,
          weatherResponse.data.dt
        );

        isWeatherInfoLoaded.value = true;
        await store.dispatch("SHOW_PRELOADER_FALSE");
      } 
      catch (error) {
        isWeatherInfoLoaded.value = false;
        await store.dispatch("SHOW_PRELOADER_FALSE");
        alert(error);
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
.weather-options {
  gap: 20px;
}
.weather-options hr {
  display: none;
}
.weather-option  {
  font-size: 20px;
}
.weather-option-title, .weather-forecast-title {
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
  .weather-options {
    gap: unset;
  }
  .weather-options hr {
    display: block;
    margin: 16px 0 !important;
  }
}
</style>
