import axios from "axios";

//#region LocationInfo
export class LocationInfo {
    public name = "";
    public country = "";
    public state = "";
    public local_names = [] as string[];
    public lat = 0;
    public lon = 0;

    public Update(locationInfo: any) {
        this.name = locationInfo.name,
        this.country = locationInfo.country,
        this.state = locationInfo.state,
        this.local_names = locationInfo.local_names,
        this.lat = locationInfo.lat,
        this.lon = locationInfo.lon
    }
}
//#endregion

//#region WeatherInfo
export class CurrentWeatherInfo {
    openWeatherIconPath: string = process.env.OPEN_WEATHER_MAP_IMG_PATH;
    public weatherId = 0;
    public weatherMain = "";
    public weatherDescription = "";
    public weatherIcon = "";
    public temp = 0;
    public feels_like = 0; 
    public pressure = 0; 
    public humidity = 0; 
    public temp_min = 0; 
    public temp_max = 0; 
    public visibility = 0; 
    public windSpeed = 0;
    public windDeg = 0;
    public windGust = 0;
    public cloudiness = 0
    public rain1h: number | undefined = 0;
    public rain3h: number | undefined = 0;
    public snow1h: number | undefined = 0;
    public snow3h: number | undefined = 0;
    public cityName = "";
    public dt = 0;
    public dt_text = "";

    public Update(
        weather: any,
        main: any, 
        wind: any,
        clouds: any, 
        visibility: number,
        rain: any,
        snow: any,
        name: string,
        dt: number
    ) {
        this.weatherId = weather.id;
        this.weatherMain = weather.main;
        this.weatherDescription = weather.description;
        this.weatherIcon = this.openWeatherIconPath + weather.icon + '.png';
        this.temp = Math.round(main.temp);
        this.feels_like = Math.round(main.feels_like);
        this.pressure = main.pressure;
        this.humidity = main.humidity;
        this.temp_max = Math.round(main.temp_max);
        this.temp_min = Math.round(main.temp_min);
        this.visibility = visibility;
        this.windSpeed =  wind.speed ? wind.speed.toFixed(1) : undefined;
        this.windDeg = wind.deg;
        this.windGust = wind.gust ? wind.gust.toFixed(1) : undefined;
        this.cloudiness = clouds.all;
        this.rain1h = rain ? rain["1h"] : undefined;
        this.rain3h = rain ? rain["3h"] : undefined;
        this.snow1h = snow ? snow["1h"] : undefined;
        this.snow3h = snow ? snow["3h"] : undefined;
        this.cityName = name;
        this.dt = dt;
        this.dt_text = new Date(dt * 1000).toLocaleString();
    }
}
//#endregion

//#region ForecastInfo 
export class ForecastInfo {
    public cityCountry = "";
    public cityPopulation = 0;
    public citySunrise = 0;
    public citySunset = 0;
    public cityTimezone = 0;
    public cnt = 0;
    public list: Array<CurrentWeatherInfo> = []

    public Update(
        city: any,
        cnt: number,
        list: Array<any>
    ) {
        this.cityCountry = city.country;
        this.cityPopulation = city.population;
        this.citySunrise = city.sunrise;
        this.citySunset = city.sunset;
        this.cityTimezone = city.timezone;
        this.cnt = cnt;
        this.list = [];
        list.forEach(el => {
            const currentWeatherInfo = new CurrentWeatherInfo();
            currentWeatherInfo.Update(
                el.weather[0],
                el.main,
                el.wind,
                el.clouds,
                el.visibility,
                el.rain,
                el.snow,
                el.name,
                el.dt
            );
            this.list.push(currentWeatherInfo);
        })
    }
}
//#endregion

class WeatherService {
    private API: string = process.env.OPEN_WEATHER_MAP_API;
    private limit = 1;
    private defaultOptions: object = {
        lang: 'ru',
        appid: process.env.OPEN_WEATHER_MAP_API_KEY
    };
    public GetLocationInfoByName(location: string): Promise<any> {
        return axios.get(this.API + "/geo/1.0/direct", {
            params: {
                ...this.defaultOptions,
                q: location,
                limit: this.limit
            }
        })
    }
    public GetCurrentWeatherByLocation(locationInfo: LocationInfo): Promise<any> {
        return axios.get(this.API + "/data/2.5/weather", {
            params: {
                ...this.defaultOptions,
                lon: locationInfo.lon,
                lat: locationInfo.lat,
                units: 'metric'
            }
        })
    }
    public GetForecastWeatherByLocation(locationInfo: LocationInfo): Promise<any> {
        return axios.get(this.API + "/data/2.5/forecast", {
            params: {
                ...this.defaultOptions,
                lon: locationInfo.lon,
                lat: locationInfo.lat,
                units: 'metric'
            }
        })
    }
}

export default new WeatherService();