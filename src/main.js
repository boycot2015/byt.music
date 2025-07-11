import './assets/styles/main.css'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores' // 引入store
import { apiUrl, musicApiUrl } from './api/baseUrl'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const Icons = import.meta.glob('./components/icons/*.vue')

const app = createApp(App)
app.use(store)
app.use(router)
app.config.globalProperties.$apiUrl = apiUrl
app.config.globalProperties.$musicApiUrl = musicApiUrl
for (const [key, component] of Object.entries(Icons)) {
  const componentName = key.replace('./components/icons/', '').replace('.vue', '')
  app.component(componentName, (await component()).default)
}
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
