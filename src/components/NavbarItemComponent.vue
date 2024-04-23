<template>
<div 
    @click="navigateTo(navItem.path)"
    class="d-flex flex-row align-items-center gap-2">
        <img :src="navItem.img">
        <a v-show="!isMobile || (showMenu && isMobile)">{{navItem.name}}</a> 
</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';
import { useStore } from '@/store/store';
import { NavItem } from '../shared/navPages';

export default defineComponent({
    name: "NavbarItemComponent",
    props: {
        navItem: { 
            type: Object as PropType<NavItem>,
            required: true
        }
    },
    setup() {
        const router = useRouter();
        const store = useStore();

        return {
            navigateTo: async (path: RouteLocationRaw) => {
                await store.dispatch("NAVBAR_MENU_HIDE");
                router.push(path);
            },
            showMenu: computed<boolean>(() => store.getters.getShowMenu),
            isMobile: computed<boolean>(() => store.getters.getIsMobile)
        }
    }
})
</script>

<style scoped>
div {
    height: 25px;
    cursor: pointer;
}
img {
    width: 20px !important;
    height: 20px !important;
}
a {
    color: white !important;
}
</style>