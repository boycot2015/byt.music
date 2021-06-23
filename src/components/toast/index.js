import { createApp } from 'vue'
import domUtils from '@/utils/dom.js'
// 这里就是我们刚刚创建的那个静态组件
import toastComponent from './toast.vue'
let $inst
// 创建挂载实例
const createMount = (opts) => {
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const app = createApp(toastComponent, {
        ...opts,
        showWrap: true,
        remove () {
            app.unmount(mountNode)
            document.body.removeChild(mountNode)
        }
    })
    return app.mount(mountNode)
}

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function showToast (options = {
    text: '',
    showWrap: true, // 是否显示组件
    showContent: true // 作用:在隐藏组件之前,显示隐藏动画
}) {
    options.id = options.id || 'toast_' + domUtils.generateId()
    options.text = options.text || ''
    options.duration = options.duration || 2000
    // 提前 250ms 执行淡出动画(因为我们再css里面设置的隐藏动画持续是250ms)
    setTimeout(() => { toastComponent.showContent = false }, options.duration - 1250)
    // 过了 duration 时间后隐藏整个组件
    setTimeout(() => { toastComponent.showWrap = false }, options.duration)
    $inst = createMount(options)
    return $inst
}

showToast.install = app => {
    app.component('showToast', toastComponent)
    app.config.globalProperties.$MessageBox = showToast
    app.provide('showToast', showToast)
}
export default showToast
