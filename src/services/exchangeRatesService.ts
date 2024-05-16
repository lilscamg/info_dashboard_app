import axios from "axios";

export class ExchangeRatesInfo {
    public date = "";
    public info: any | null = null;
    public Update(responseInfo: any, currencyName: string) {
        this.date = responseInfo.date,
        this.info = responseInfo[currencyName]
    }
}

export class CurrencySymbolList {
    public list: Array<CurrencySymbol> = [];
    public Update(responseInfo: Array<any>) {
        responseInfo.forEach(el => {
            this.list.push(
                new CurrencySymbol(
                    el.currency,
                    el.abbreviation,
                    el.symbol
                )
            )
        })
    }
}

export class CurrencySymbol {
    constructor(
        public currency: string, 
        public abbreviation: string, 
        public symbol: string
    ) { }
}

class ExchangeRatesService {
    private API: string = process.env.FAWAZAHMED0_CURRENCY_API;
    private currencySymbolsAPI: string = process.env.CURRENCY_SYMBOLS_API;

    public getAvailableCurrencies(date = "latest"): Promise<any> {
        return axios.get(`${this.API + date}/v1/currencies.json`);
    }  
    public getCurrencySymbols() {
        return axios.get(`${this.currencySymbolsAPI}/currency-symbols.json`)
    }
    public getExchangeRate(currencyName: string, date = "latest"): Promise<any> {
        return axios.get(`${this.API + date}/v1/currencies/${currencyName}.json`);
    }
} 

export default new ExchangeRatesService();