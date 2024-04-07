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
        img: "home.png"
    },
    {
        id: 2,
        name: "Погода",
        path: "/weather",
        img: "cloudy.png"
    },
    {
        id: 3,
        name: "Курсы валют",
        path: "/exchange-rates",
        img: "currency.png"
    }
] 
