<template>
  <div class="view-title">Погода</div>
  <div class="d-flex gap-2 mb-4">
    <InputComponent
      :value="locationInput" 
      :label="'Город, село и т.д.'" 
      :placeholder="isMobile ? 'Напр. Казань' : 'Например, Казань'"
      class="w-100"
      @inputEvent="inputEventHandler">
    </InputComponent>
    <ButtonComponent 
      :text="'Поиск'"
      @click="getWeather">
    </ButtonComponent> 
  </div>

  <div class="app-card">
    <!-- to do: вынести в отдельный компонент -->
    <div 
      class="info-not-found" 
      v-if="!isWeatherInfoLoaded">
      <img src="@/assets/weather-not-found.png" >
      <span>Ничего не найдено</span>
    </div>
    <div 
      class="d-flex flex-column" 
      v-else>
      <!-- Время и локация -->
      <div class="weather-location">
        <span>Прогноз на {{ currentWeatherInfo.dt_text }} для:</span><br>
        <span class="c-main text-bold">
          {{ (locationInfo.local_names && locationInfo.local_names[lang]) ? locationInfo.local_names[lang] : locationInfo.name }}
          {{ locationInfo.state && locationInfo.state !== locationInfo.name ? ", " + locationInfo.state : "" }}
        </span>
      </div>
      <!-- Описание погоды -->
      <div class="weather-desc d-flex flex-sm-row flex-column align-items-sm-center">
        <div class="me-3">
          <img class="me-2" :src="currentWeatherInfo.weatherIcon" aкlt="">
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
            <span class="col-auto">Ощущается как:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.feels_like }}°</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.temp_min">
            <span class="col-auto">Мин. температура:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.temp_min }}°</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.temp_max">
            <span class="col-auto">Макс. температура:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.temp_max }}°</span>
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
            <span class="col-auto">Скорость ветра:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.windSpeed }} м/с</span>
          </div>
          <div class="row">
            <span class="col-auto">Направление:</span>
            <div class="col-auto c-main text-bold">
              <img 
                src="@/assets/icons/up-arrow.png"
                :style="{transform: `rotate(${currentWeatherInfo.windDeg}deg)`}" 
                alt="">
            </div>
          </div>
          <div class="row" v-if="currentWeatherInfo.windGust">
            <span class="col-auto">Порыв ветра:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.windGust }} м/с</span>
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
            <span class="col-auto">Дождь (посл. 1 час):</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.rain1h }} мм</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.rain3h">
            <span class="col-auto">Дождь (посл. 3 часа):</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.rain3h }} мм</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.snow1h">
            <span class="col-auto">Снег (посл. 1 час):</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.snow1h }} мм</span>
          </div>
          <div class="row" v-if="currentWeatherInfo.snow3h">
            <span class="col-auto">Снег (посл. 3 часа):</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.snow3h }} мм</span>
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
            <span class="col-auto">Влажность:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.humidity }} %</span>
          </div>
          <div class="row">
            <span class="col-auto">Давление:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.pressure }} гПа</span>
          </div>
          <div class="row">
            <span class="col-auto">Видимость:</span>
            <span class="col-auto c-main text-bold">{{ currentWeatherInfo.visibility }} м</span>
          </div>
        </div>
      </div>
      <hr>
      <!-- Прогноз на несколько дней -->
      <div class="row">
        <div class="col-12 mb-2 weather-forecast-title">
          <div class="row">
            <div class="col-auto">Погода на 5 дней</div>
            <div class="col">
              <img src="@/assets/icons/calendar.png" alt="">
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="weather-forecast-items" @wheel="forecastScroll" ref="foreacastScrollableContainer">
            <div
              class="app-card"
              v-for="weatherInfo in forecastInfo.list"
              :key="weatherInfo.dt">
                <div>{{ weatherInfo.dt_text }}</div>
                <div class="d-flex justify-content-center align-items-center">
                  <img class="me-2" :src="weatherInfo.weatherIcon" alt="">
                  <span class="c-main text-bold">{{ weatherInfo.temp }}°</span>
                </div>
                <div class="d-flex justify-content-center align-items-center text-bold text-uppercase">
                  {{ weatherInfo.weatherDescription }}
                </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  </div>
  <ModalComponent ref="modalRef"></ModalComponent>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import InputComponent from '@/components/UI/InputComponent.vue';
import ButtonComponent from '@/components/UI/ButtonComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import weatherService, { LocationInfo, CurrentWeatherInfo, ForecastInfo } from '@/services/weatherService';
import { useStore } from '@/store/store';

export default defineComponent({
  name: 'WeatherView',
  components: {
    InputComponent,
    ButtonComponent,
    ModalComponent
  },

  setup() {
    const store = useStore();
    const isMobile = computed<boolean>(() => store.getters.getIsMobile);
    const lang = computed<any>(() => store.getters.getLang);
    const isWeatherInfoLoaded = ref<boolean>(false);
    const locationInput = ref<string>("Казань");
    const isModalShown = ref<boolean>(false);
    let locationInfo = reactive<LocationInfo>(new LocationInfo());
    let currentWeatherInfo = reactive<CurrentWeatherInfo>(new CurrentWeatherInfo());
    let forecastInfo = reactive<ForecastInfo>(new ForecastInfo());
    const modalRef = ref<InstanceType<typeof ModalComponent> | null>(null);
    const foreacastScrollableContainer = ref<any>(null); 

    // onMounted(() => {
    //   getWeather();
    // })

    const getWeather = async () => {
      // если ничего не введено
      if (locationInput.value.trim() === "") {
        isWeatherInfoLoaded.value = false;
        showModal("Ошибка", "Введите название локации");
        return;
      }

      await store.dispatch("SHOW_PRELOADER_TRUE");
      try {
        // получение локации
        const locationResponse = await weatherService.GetLocationInfoByName(locationInput.value);
        locationInfo.Update(locationResponse.data[0]);
        // получение погоды сейчас
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
          weatherResponse.data.dt,
        );
        
        // получение погоды на 3 дня
        const forecastResponse = await weatherService.GetForecastWeatherByLocation(locationInfo);
        forecastInfo.Update(
          forecastResponse.data.city,
          forecastResponse.data.cnt,
          forecastResponse.data.list
        )

        isWeatherInfoLoaded.value = true;
        await store.dispatch("SHOW_PRELOADER_FALSE");
      } 
      catch (error: any) {
        isWeatherInfoLoaded.value = false;
        await store.dispatch("SHOW_PRELOADER_FALSE");
        showModal("Ошибка", "Произошла ошибка при получении погоды", error.toString());
      }
    };

    const inputEventHandler = (inputValue: string) => {
      locationInput.value = inputValue;
    }

    const showModal = (title: string, text: string, error: string | null = null) => {
      if (!modalRef.value) {
        alert("modalRef еще не смонтирован");
        return;
      }
      modalRef.value.showModal(true, title, text, error);
    }

    const forecastScroll = (event: any) => {
      if (!foreacastScrollableContainer.value) {
        return;
      }
      event.preventDefault();
      foreacastScrollableContainer.value.scrollLeft += event.deltaY;
    }

    return {
      lang,
      isMobile,
      isWeatherInfoLoaded,
      locationInput,
      isModalShown,
      locationInfo,
      currentWeatherInfo,
      forecastInfo,
      modalRef,
      foreacastScrollableContainer,
      getWeather,
      inputEventHandler,
      showModal,
      forecastScroll
    }
  }
});
</script>

<style scoped>
.weather-location {
  font-size: var(--fs-md);
  line-height: 1;
  margin-bottom: var(--default-offset);
}
.weather-desc {
  text-transform: uppercase;
  font-size: var(--fs-lg);
  font-weight: 700;
}
.weather-options {
  gap: var(--default-offset);
}
.weather-options hr {
  display: none;
}
.weather-option  {
  font-size: var(--fs-md);
}
.weather-option-title, .weather-forecast-title {
  font-size: var(--fs-lg);
  font-weight: 700;
}
.weather-forecast-items {
  display: flex;
  overflow-x: scroll;
  white-space: nowrap;
  gap: var(--default-offset);
  padding-bottom: 10px;
}
.weather-forecast-item {
  padding: var(--default-offset);
  border: 1px solid var(--gray-color);
}
@media (max-width: 450px) {
  .info-not-found img {
    width: 128px;
    height: 128px;
  }
  .weather-desc {
    font-size: var(--fs-md);
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
