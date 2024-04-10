import axios from "axios";

export class LocationInfo {
    public name: string;
    public country: string;
    public state: string;
    public local_names: object;
    public lon: number;
    public lat: number;

    constructor() {
        this.name = "";
        this.country = "";
        this.state = "";
        this.local_names = {};
        this.lat = 0;
        this.lon = 0;
    }
}

export class WeatherInfo {
    
}


class WeatherService {
    private API: string = process.env.OPEN_WEATHER_MAP_API;
    private limit = 1;

    public GetLocationInfoByName(location: string): Promise<any> {
        return axios.get(this.API + "/geo/1.0/direct", {
            params: {
                q: location,
                limit: this.limit,
                appid: process.env.OPEN_WEATHER_MAP_API_KEY
            }
        })
    }

    public GetWeatherByLocation(locationInfo: LocationInfo): Promise<any> {
        return axios.get(this.API + "/data/2.5/weather", {
            params: {
                lon: locationInfo.lon,
                lat: locationInfo.lat,
                appid: process.env.OPEN_WEATHER_MAP_API_KEY
            }
        })
    }
}

export default new WeatherService();