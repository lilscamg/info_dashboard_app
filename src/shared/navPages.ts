export class NavItem {
    constructor(
        public id: number,
        public name: string,
        public path: string,
        public img: string) 
    {}
}

import homeIcon from "@/assets/icons/home.png";
import weatherIcon from "@/assets/icons/cloudy.png"
import exchangeRatesIcon from "@/assets/icons/currency.png";

export const navItems: NavItem[] = [
    // {
    //     id: 1,
    //     name: "Главная",
    //     path: "/",
    //     img: homeIcon
    // },
    {
        id: 2,
        name: "Погода",
        path: "/weather",
        img: weatherIcon
    },
    {
        id: 3,
        name: "Курсы валют",
        path: "/exchange-rates",
        img: exchangeRatesIcon
    }
] 
