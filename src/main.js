import './assets/styles/main.css'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores' // 引入store
import { apiUrl, musicApiUrl } from './api/baseUrl'
import 'element-plus/theme-chalk/dark/css-vars.css'
import Components from './components/index';

const app = createApp(App)
app.use(store)
app.use(router)

app.config.globalProperties.$apiUrl = apiUrl
app.config.globalProperties.$musicApiUrl = musicApiUrl

app.use(Components)

app.mount('#app')
