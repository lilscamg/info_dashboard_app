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
        this.temp = main.temp;
        this.feels_like = main.feels_like;
        this.pressure = main.pressure;
        this.humidity = main.humidity;
        this.temp_max = main.temp_max;
        this.temp_min = main.temp_min;
        this.visibility = visibility;
        this.windSpeed = wind.speed;
        this.windDeg = wind.deg;
        this.windGust = wind.gust;
        this.cloudiness = clouds.all;
        this.rain1h = rain ? rain["1h"] : undefined,
        this.rain3h = rain ? rain["3h"] : undefined,
        this.snow1h = snow ? snow["1h"] : undefined,
        this.snow3h = snow ? snow["3h"] : undefined,
        this.cityName = name,
        this.dt = dt
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
}

export default new WeatherService();