import './assets/styles/main.css'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores' // 引入store
import { apiUrl } from './api/baseUrl'

const app = createApp(App)
app.use(store)
app.use(router)
app.config.globalProperties.$apiUrl = apiUrl

app.mount('#app')
