import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import '../public/global.css'

import { createApp } from 'vue'
import router from './router/router'
import { store, key } from './store/store'
import App from './App.vue'

createApp(App)
    .use(router)
    .use(store, key)
    .mount('#app')
