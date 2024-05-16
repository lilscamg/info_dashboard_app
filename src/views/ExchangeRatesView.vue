<template>
    <div class="view-title">Курсы валют</div>
    <div class="row mb-4">
      <div class="col-12 col-sm mb-3 mb-sm-0">
        <InputComponent
          @inputEvent="currencyAmountInputHandler"
          :type="'number'"
          :value="currencyAmount"
          :label="'Сумма'"
          :placeholder="isMobile ? 'Напр. 100' : 'Например, 100'"
          ref="currencyAmountInputRef">
        </InputComponent>
      </div>
      <div class="col ps-sm-0">
        <InputComponent
          @inputEvent="baseCurrencyInputHandler"
          :value="baseCurrency"
          :label="isMobile? 'Из' : 'Перевести из'"
          :placeholder="isMobile ? 'Напр. usd' : 'Например, usd'"
          ref="baseCurrencyInputRef">
        </InputComponent>
      </div>
      <div 
        class="col-auto px-0 d-flex flex-column justify-content-center"
        @click="changeCurrencies">
        <img src="@/assets/right-and-left.png" alt="">
      </div>
      <div class="col pe-sm-0">
        <InputComponent
          @inputEvent="resultCurrencyInputHandler"
          :value="resultCurrency"
          :label="isMobile? 'В' : 'Перевести в'"
          :placeholder="isMobile ? 'Напр. rub' : 'Например, rub'"
          ref="resultCurrencyInputRef">
        </InputComponent>
      </div>
      <div class="col-12 col-sm-auto mt-3 mt-sm-0 ">
        <ButtonComponent
          class="h-100 w-100 w-sm-auto"
          :text="'Перевод'"
         @click="getExchangeRatesInfo">
       </ButtonComponent>
      </div>
    </div>
    <div class="app-card">
      <!-- to do: вынести в отдельный компонент -->
      <div 
        class="info-not-found" 
        v-if="!isExchangeRatesInfoLoaded">
        <img src="@/assets/money-not-found.png" >
        <span>Ничего не найдено</span>
      </div>
      <div
        class="" 
        v-else>
        <div class="exchange-rates-date">Курс от <span>{{ exchangeRatesInfo.date }}</span></div>
        <div class="exchange-rates-info">
          <div>{{ currencyAmount }} <span>{{getCurrencySymbol(baseCurrency)}}</span> = {{getConvertedAmount()}} <span>{{getCurrencySymbol(resultCurrency)}}</span></div>
        </div>
      </div>
    </div>
    <ModalComponent ref="modalRef"></ModalComponent>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue';
import InputComponent from '@/components/UI/InputComponent.vue';
import ButtonComponent from '@/components/UI/ButtonComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import exchangeRatesService, { ExchangeRatesInfo, CurrencySymbolList } from '@/services/exchangeRatesService';
import { useStore } from '@/store/store';

export default defineComponent({
  name: 'ExchangeRatesView',
  components: {
    InputComponent,
    ButtonComponent,
    ModalComponent
  },
  setup() {
    const store = useStore();
    const isMobile = computed<boolean>(() => store.getters.getIsMobile);
    const modalRef = ref<InstanceType<typeof ModalComponent> | null>(null);
    const baseCurrencyInputRef = ref<InstanceType<typeof InputComponent> | null>(null);
    const resultCurrencyInputRef = ref<InstanceType<typeof InputComponent> | null>(null);
    const currencyAmountInputRef = ref<InstanceType<typeof InputComponent> | null>(null);
    const isExchangeRatesInfoLoaded = ref<boolean>(false);

    let availableCurrencies = {};
    let currencySymbols = reactive<CurrencySymbolList>(new CurrencySymbolList);
    const currencyAmount = ref<number>(1);
    const baseCurrency = ref<string>("usd");
    const resultCurrency = ref<string>("rub");
    const exchangeRatesInfo = reactive<ExchangeRatesInfo>(new ExchangeRatesInfo());
    
    onMounted(async () => {
      await store.dispatch("SHOW_PRELOADER_TRUE");
      setTimeout(async ()=> {
        try {
          const availableCurrenciesResp = await exchangeRatesService.getAvailableCurrencies();
          const currencySymbolListResp = await exchangeRatesService.getCurrencySymbols();
          availableCurrencies = availableCurrenciesResp.data;
          currencySymbols.Update(currencySymbolListResp.data);
          await store.dispatch("SHOW_PRELOADER_FALSE");
        }
        catch (error: any) {
          await store.dispatch("SHOW_PRELOADER_FALSE");
          showModal(
            "Ошибка", 
            "Произошла ошибка при получении списка доступных валют.", 
            error.toString())
        }
      }, 500)
    })
    const baseCurrencyInputHandler = (inputValue: string): void => {
      baseCurrency.value = inputValue;
    }
    const resultCurrencyInputHandler = (inputValue: string): void => {
      resultCurrency.value = inputValue;
    }
    const currencyAmountInputHandler = (inputValue: any): void => {
      if (inputValue === "" && currencyAmountInputRef.value) {
        currencyAmount.value = 0;
        // currencyAmountInputRef.value.changeValue(0);
        return;
      }
      currencyAmount.value = inputValue;
    }
    const showModal = (
      title: string, 
      text: string, 
      error: string | null = null,
      refObj: any | null = null
    ) => {
      if (!modalRef.value) {
        alert("modalRef еще не смонтирован");
        return;
      }
      modalRef.value.showModal(true, title, text, error, refObj);
    }
    const getExchangeRatesInfo = async (): Promise<void> => {
      // если ничего не введено
      if (baseCurrency.value.trim() === "" || resultCurrency.value.trim() === "") {
        isExchangeRatesInfoLoaded.value = false;
        showModal("Ошибка", "Заполните поля конвертируемых валют");
        return;
      }
      baseCurrency.value = baseCurrency.value.toLowerCase();
      resultCurrency.value = resultCurrency.value.toLowerCase();

      if (!baseCurrencyInputRef.value || !resultCurrencyInputRef.value) {
        alert("baseCurrentInput или resultCurrencyInput еще не смонтированы")
        return;
      }
      baseCurrencyInputRef.value.changeValue(baseCurrency.value);
      resultCurrencyInputRef.value.changeValue(resultCurrency.value);

      await store.dispatch("SHOW_PRELOADER_TRUE");
      try {
        if (!Object.hasOwnProperty.call(availableCurrencies, baseCurrency.value)) {
          throw Error(`Не существует валюты с кодовым названием ${baseCurrency.value}`)
        }
        if (!Object.hasOwnProperty.call(availableCurrencies, resultCurrency.value)) {
          throw Error(`Не существует валюты с кодовым названием ${resultCurrency.value}`)
        }
        const exchangeRatesInfoResp = await exchangeRatesService.getExchangeRate(baseCurrency.value);
        exchangeRatesInfo.Update(exchangeRatesInfoResp.data, baseCurrency.value);

        isExchangeRatesInfoLoaded.value = true;
        await store.dispatch("SHOW_PRELOADER_FALSE");
      }
      catch (error: any) {
        isExchangeRatesInfoLoaded.value = false;
        await store.dispatch("SHOW_PRELOADER_FALSE");
        showModal(
          "Ошибка", 
          "Произошла ошибка при получении курса валют. Ознакомиться со списком доступных валют можно ниже.", 
          error.toString(),
          {
            link: process.env.FAWAZAHMED0_CURRENCY_API + "latest/v1/currencies.json",
            text: "Список валют"
          }
        );
      }
    } 
    const changeCurrencies = () => {
      if (baseCurrency.value.trim() === "" && resultCurrency.value.trim() === "")
        return;
      if (!baseCurrencyInputRef.value || !resultCurrencyInputRef.value) {
        alert("baseCurrentInput или resultCurrencyInput еще не смонтированы")
        return;
      }
      // замена в кастомных инпутах
      baseCurrencyInputRef.value.changeValue(resultCurrency.value);
      resultCurrencyInputRef.value.changeValue(baseCurrency.value);
      // замена в рекативных переменных
      let baseCur = baseCurrency.value;
      baseCurrency.value = resultCurrency.value;
      resultCurrency.value = baseCur;

      getExchangeRatesInfo();
    }
    const getConvertedAmount = () => {
      return (currencyAmount.value * exchangeRatesInfo.info[resultCurrency.value]); 
    }
    const getCurrencySymbol = (currency: string) => {
      const currencySymbol = currencySymbols.list.find(s => s.abbreviation.toLowerCase() === currency.toLocaleLowerCase());
      return currencySymbol?.symbol ?? currency.toUpperCase();
    }

    return {
      isMobile,
      modalRef,
      baseCurrencyInputRef,
      resultCurrencyInputRef,
      currencyAmountInputRef,
      isExchangeRatesInfoLoaded,
      currencyAmount,
      baseCurrency,
      resultCurrency,
      exchangeRatesInfo,
      baseCurrencyInputHandler,
      resultCurrencyInputHandler,
      currencyAmountInputHandler,
      getExchangeRatesInfo,
      changeCurrencies,
      getConvertedAmount,
      getCurrencySymbol
    }
  }
});
</script>

<style scoped>
.exchange-rates-date {
  font-size: var(--fs-lg);
  margin-bottom: var(--default-offset);
}
.exchange-rates-date span {
  color: var(--main-color);
  font-weight: 700;
} 
.exchange-rates-info {
  font-size: var(--fs-xxl);
  font-weight: 700;
  display: flex;
  justify-content: center;
  overflow-x: auto;
}
.exchange-rates-info span {
  color: var(--main-color);
}
@media (max-width: 450px) {
  .exchange-rates-info {
    font-size: var(--fs-xl);
  }
}
</style>