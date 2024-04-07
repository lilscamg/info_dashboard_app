export class NavItem {
    constructor(
        public id: number,
        public name: string,
        public path: string,
        public img: string) 
    {}
}

const ASSETS_PATH = "@/assets/";

export const navItems: NavItem[] = [
    {
        id: 1,
        name: "Главная",
        path: "/",
        img: ASSETS_PATH + "home.png"
    },
    {
        id: 2,
        name: "Погода",
        path: "/weather",
        img: ASSETS_PATH + "cloudy.png"
    },
    {
        id: 3,
        name: "Курсы валют",
        path: "/exchange-rates",
        img: ASSETS_PATH + "currency.png"
    }
] 
