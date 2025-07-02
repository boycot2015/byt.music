import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const piniaStore = createPinia()
piniaStore.use(piniaPluginPersistedstate)
app.use(piniaStore)
app.use(router)

app.mount('#app')
