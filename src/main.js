import './public-path'
import { createApp } from 'vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/less/index.less'
import api from './api/install'
import * as directives from './directives'

import $http from './api/axios'
import $baseUrl from './api/baseUrl'

// 引入弹窗组件MessageBox
import MessageBox from './components/MessageBox'
// 引入自定义toast组件
import showToast from './components/toast/index'
import components from './components/index'

// Plugin
// import VueCssDoodle from '@luxdamore/vue-css-doodle'
// import '@luxdamore/vue-css-doodle/dist/VueCssDoodle.css'

const VueInstance = createApp(App)
Object.keys(directives).forEach(k => {
    VueInstance.directive(k, directives[k])
})
Object.keys(components).forEach(k => {
    VueInstance.component(k, components[k])
})
VueInstance.config.globalProperties.$http = $http
VueInstance.config.globalProperties.$baseUrl = $baseUrl
VueInstance.config.ignoredElements = ['css-doodle']
// VueInstance.use(VueCssDoodle)
VueInstance.use(api)
    // .use(ElementPlus)
    .use(MessageBox)
    .use(showToast)
    .use(store)
    .use(router)
    .mount('#app')

// console.log(VueInstance)
