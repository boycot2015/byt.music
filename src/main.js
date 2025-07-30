import './assets/styles/main.css'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores' // 引入store
import { apiUrl, musicApiUrl } from './api/baseUrl'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
const Icons = import.meta.glob('./components/icons/*.vue')
import Image from './components/Image/index.vue'
import Empty from './components/Empty/index.vue'
const app = createApp(App)
app.use(store)
app.use(router)

app.config.globalProperties.$apiUrl = apiUrl
app.config.globalProperties.$musicApiUrl = musicApiUrl

// eslint-disable-next-line vue/no-reserved-component-names
app.component('Image', Image)
Object.entries(Icons).forEach(async ([key, component]) => {
  const componentName = key.replace('./components/icons/', '').replace('.vue', '')
  app.component(componentName, (await component()).default)
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Empty', Empty) 
app.mount('#app')
