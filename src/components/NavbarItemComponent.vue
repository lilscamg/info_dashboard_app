<template>
<div 
    @click="navigateTo(navItem.path)"
    class="d-flex flex-row align-items-center gap-2">
        <img v-show="isMobile" :src="navItem.img">
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
            navigateTo: (path: RouteLocationRaw) => {
                router.push(path);
            },
            showMenu: computed(() => store.getters.getShowMenu),
            isMobile: computed(() => store.getters.getIsMobile)
        }
    }
})
</script>

<style scoped>
img {
    width: 20px !important;
    height: 20px !important;
}
a {
    cursor: pointer;
}
</style>