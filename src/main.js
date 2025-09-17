import './assets/styles/main.css'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores' // 引入store
import { apiUrl, musicApiUrl } from './api/baseUrl'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { isPc } from './utils'
import VConsole from 'vconsole';
import Components from './components/index';

const app = createApp(App)
app.use(store)
app.use(router)

app.config.globalProperties.$apiUrl = apiUrl
app.config.globalProperties.$musicApiUrl = musicApiUrl

app.use(Components)
 
//如果不是生产环境并且不是pc设备那么就显示调试
if (process.env.NODE_ENV != "production" && !isPc()) {
    console.log(process.env.NODE_ENV);
    const vConsole = new VConsole({
        zIndex: 999999,
    });
}
app.mount('#app')
