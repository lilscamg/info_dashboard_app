import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

// define your typings for the store state
export interface State {
    isMobile: boolean,
    showMenu: boolean
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state: {
        showMenu: false,
        isMobile: false
    },
    getters: {
        getShowMenu: (state) => state.showMenu, 
        getIsMobile: (state) => state.isMobile
    },
    mutations: {
        ["SET_NAVBAR_MENU"]: (state, isHidden) => {
            state.showMenu = isHidden;
        },
        ["SET_IS_MOBILE"]: (state, isMobile) => {
            state.isMobile = isMobile;
        }
    },
    actions: {
        ["NAVBAR_MENU_SHOW"]: ({commit}) => {
            commit("SET_NAVBAR_MENU", true);
        },
        ["NAVBAR_MENU_HIDE"]: ({commit}) => {
            commit("SET_NAVBAR_MENU", false);
        },
        ["SET_IS_MOBILE_TRUE"]: ({commit}) => {
            commit("SET_IS_MOBILE", true);
        },
        ["SET_IS_MOBILE_FALSE"]: ({commit}) => {
            commit("SET_IS_MOBILE", false);
        }
    }
});

// define your own `useStore` composition function
export function useStore () {
    return baseUseStore(key);
}
