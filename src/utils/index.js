import Dexie from 'dexie'
import baseUrl from '@/api/baseUrl'
import axios from '@/api/axios'
export const drag = (options) => {
    var obj = options.obj
    var target = options.target || obj
    var site = options.site || {}
    var fn = options.fn
    // var cancelElem = options.cancelElem
    var dmW = document.documentElement.clientWidth || document.body.clientWidth
    var dmH = document.documentElement.clientHeight || document.body.clientHeight
    site = site || {}
    obj = obj[0]
    target = target[0]
    if (!target) return
    var adsorb = site.n || 0 // 磁性吸附的吸附范围
    var l = site.l || 0
    var r = (site.r || site.r === 0) ? site.r : dmW - target.offsetWidth
    var t = site.t || 0
    var b = (site.b || site.b === 0) ? site.b : dmH - target.offsetHeight
    obj.onmousedown = function (ev) {
        r = (site.r || site.r === 0) ? site.r : dmW - target.offsetWidth
        b = (site.b || site.b === 0) ? site.b : dmH - target.offsetHeight
        var oEvent = ev || event
        var siteX = oEvent.clientX - target.offsetLeft
        var siteY = oEvent.clientY - target.offsetTop
        ev.stopPropagation()
        // 获取需要排除的元素
        if (options.cancelElem) {
            var elemCancel = []
            options.cancelElem.map(el => {
                const res = closest(ev.target, el)
                if (res !== null) {
                    elemCancel.push(res)
                }
            })
            // 如果拖拽的是排除元素，函数返回
            if (elemCancel.length) {
                return true
            }
        }
        if (target.setCapture) { // 兼容IE低版本的阻止默认行为，并实现事件捕获
            obj.onmousemove = move
            obj.onmouseup = up
            obj.setCapture()
        } else {
            document.onmousemove = move
            document.onmouseup = up
        }
        function move (ev) {
            var oEvent = ev || event
            var iLeft = oEvent.clientX - siteX
            var iTop = oEvent.clientY - siteY
            ev.stopPropagation()
            if (iLeft <= l + adsorb) { // 限制拖动范围
                iLeft = 0
            }
            if (iLeft >= r - adsorb) {
                iLeft = r
            }
            if (iTop <= t + adsorb) {
                iTop = 0
            }
            if (iTop >= b - adsorb) {
                iTop = b
            }
            if (fn) { // 执行回调函数，如果有其他附加情况需要处理
                fn({ left: iLeft, top: iTop })
            }
            target.style.left = iLeft + 'px'
            target.style.top = iTop + 'px'
        }
        function up () {
            var oEvent = ev || event
            var iLeft = oEvent.clientX - siteX
            var iTop = oEvent.clientY - siteY
            if (options.end) options.end({ left: iLeft, top: iTop })
            this.onmousemove = null
            this.onmouseup = null
            this.onclick = null
            if (obj.setCapture) { // 拖放结束后释放捕获
                obj.releaseCapture()
            }
        }
        return this
    }
}
export const closest = (el, selector) => {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
    while (el) {
        if (matchesSelector.call(el, selector)) {
            break
        }
        el = el.parentElement
    }
    return el
}
export const filterPlayCount = (num) => {
    num = num >= 100000000
        ? parseFloat(num / 100000000).toFixed(2) + '亿' : num >= 10000
            ? parseFloat(num / 10000).toFixed(2) + '万' : num
    return num
}
export const filterDruationTime = (dt) => {
    var min = Math.floor(dt / 60 / 1000)
    var second = Math.round(dt / 1000 % 60)
    min = min < 10 ? '0' + min : min
    second = second < 10 ? '0' + second : second
    return min + ':' + second
}
export const filterTime = (timeStr) => {
    const time = new Date(timeStr)
    const month = time.getMonth() + 1
    const day = time.getDate()
    let hours = time.getHours()
    hours = hours < 10 ? '0' + hours : hours
    let min = time.getMinutes()
    min = min < 10 ? '0' + min : min
    return month + '月' + day + '日 ' + hours + ':' + min
}

// 本地存储
export const store = {
    state: {},
    getters: () => {
        return this.state
    },
    /**
         * 获取本地存储
         * @param {*} key 存储的键
         */
    get (key) {
        const data = JSON.parse(localStorage.getItem(key))
        if (data != null) {
            if (data.expirse != null && data.expirse < new Date().getTime()) {
                this.remove()
            } else {
                return data.value
            }
        }
        return null
    },
    /**
         * 获取本地存储
         * @param {*} key 存储的键名称
         * @param {*} value 值
         * @param {*} time 过期时间，不设置为永久
         */
    set (key, value, time = new Date().getTime() + 24 * 60 * 60 * 1000) {
        const data = { value, expirse: new Date(time).getTime() }
        localStorage.setItem(key, JSON.stringify(data))
    },
    /**
         * 移除本地存储
         * @param {*} key 存储的键
         */
    remove (key) {
        window.localStorage.removeItem(key)
    },
    action: {},
    mutations: {}
}

//
// 本地存储indexedDB
//
export const db = new Dexie('musicdatebase', { keyPath: '2222' })

export const animate = (ele, target, attr, type) => {
    // 先清定时器
    clearInterval(ele.timer)
    ele.timer = setInterval(function () {
        // 四部
        // 1.获取步长
        var leader = 0
        if (type === 1) {
            leader = ele[attr]
        } else {
            leader = parseInt(getStyle(ele, attr)) || 0// 获取值可能含有px，我们只取数字部分parseInt()
        }
        var step = (target - leader) / 50
        // 2.二次加工步长
        step = step > 0 ? Math.ceil(step) : Math.floor(step)
        leader = leader + step
        // 3.赋值
        !type && (ele.style[attr] = leader + 'px')
        type && (ele[attr] = leader)
        // 4.清除定时器
        // console.log(target - leader, step, ele[attr])
        // Math.abs(target - leader) ||  target === leader
        if (target === leader) {
            !type && (ele.style[attr] = target + 'px')
            type === 1 && (ele[attr] = target)
            clearInterval(ele.timer)
        }
    }, 10)
}

// 兼容方法获取元素样式

function getStyle (ele, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[attr]
    }
    return ele.currentStyle[attr]
}
/**
 * zch-2021-06-24
 * 更换主题
 * @param {*} $event 事件
 * @param {*} themeConfig 主题配置
 * @param {*} selector 需要设置主题的dom选择器
 */
export const changeTheme = ($event, themeConfig, selector = '.cloud_music') => {
    const localTheme = store.get('themeConfig')
    if (localTheme && localTheme !== null) {
        themeConfig = { ...JSON.parse(localTheme), ...themeConfig }
    }
    const musicClass = selector.split('.')[1]
    const root = document.querySelector(':root')
    if (root === null) return Promise.resolve(themeConfig)
    const imagesNameArr = getLocalBgUrls()
    let { themeColor, colors } = getLocalColors(24)
    let bgUrlIndex = (themeConfig && themeConfig.bgUrlIndex) || 0
    const colorIndex = (themeConfig && themeConfig.colorIndex) || 0
    if ($event && $event.target) {
        const className = $event.target.className
        $event && ($event.target.classList = className + ' active')
        setTimeout(() => {
            $event.target.classList = className
        }, 300)
    }
    if (themeConfig && !$event) {
        if (typeof themeConfig === 'string') {
            themeConfig = JSON.parse(themeConfig)
        }
        document.querySelector(selector).classList = musicClass
        themeConfig.themeColor = themeConfig.themeColor || themeColor
        themeConfig.colors = colors
        document.querySelector(selector).style.backgroundImage = `url(${themeConfig.bgUrl})`
        document.querySelector(selector).classList = musicClass + ' theme'
        themeConfig.themeColor && root.setAttribute('style', '--primary-color:' + themeConfig.themeColor.primary)
        themeConfig.bgUrlList = imagesNameArr
        store.set('themeConfig', JSON.stringify(themeConfig))
        return Promise.resolve(themeConfig)
    }
    root.setAttribute('style', '--primary-color:' + themeColor.primary)
    bgUrlIndex = Math.floor(Math.random() * (imagesNameArr.length - 1))
    const bgUrl = imagesNameArr[bgUrlIndex]
    themeColor = colors[colorIndex]
    themeConfig = { bgUrl, themeColor, bgUrlIndex, bgUrlList: imagesNameArr, colors, colorIndex }
    store.set('themeConfig', JSON.stringify(themeConfig))
    document.querySelector(selector).style.backgroundImage = `url(${bgUrl})`
    document.querySelector(selector).classList = musicClass
    return Promise.resolve(themeConfig)
}

export const getLocalBgUrls = () => {
    const requireModule = require.context(
        '../assets/images/bgs/',
        false,
        /(\.png|\.jpg|\.jpeg)$/
    )
    const imagesNameArr = []
    const urlsArr = []
    for (var i = 0; i < requireModule.keys().length; i++) {
        imagesNameArr.push(requireModule.keys()[i].substr(2, requireModule.keys()[i].length))
    }
    imagesNameArr.map(el => {
        urlsArr.push(require(`../assets/images/bgs/${el}`))
    })
    return urlsArr
}
export const getLocalColors = (count = 28) => {
    // const localColor = store.get('colors')
    // if (localColor && localColor !== null) return store.get('colors')
    const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']
    let bgUrlIndex = 0
    const colorsArr = []
    const getColor = () => {
        const themeColor = {
            primary: '#',
            second: '#'
        }
        for (let index = 0; index < 6; index++) {
            bgUrlIndex = Math.floor(Math.random() * (colors.length - 1))
            themeColor.primary += colors[bgUrlIndex]
            bgUrlIndex = Math.floor(Math.random() * (colors.length - 1))
            themeColor.second += colors[bgUrlIndex]
        }
        return themeColor
    }
    for (let index = 0; index < count; index++) {
        colorsArr.push(getColor())
    }
    return { themeColor: colorsArr[0], colors: colorsArr }
}
// 事件防抖函数
export const debounce = (func, wait, immediate) => {
    let timeout = null
    return function () {
        const args = arguments
        const later = function () {
            timeout = null
            if (!immediate) func.apply(this, args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(this, args)
    }
}
export const getMenu = (routes) => {
    routes.map(async el => {
        el.children && (el.children = el.children.filter(val => !val.meta.hideInMenu))
        if (el.request) {
            if (store.get('cookie') && store.get('userInfo')) {
                const arr = await axios.get(baseUrl + el.request.apiUrl, { params: { uid: store.get('userInfo').account.id } })
                if (el.request.sort && el.request.sort instanceof Function) {
                    arr.playlist = el.request.sort(arr.playlist, { uid: store.get('userInfo').account.id })
                }
                el.children = arr.playlist.map(item => ({
                    name: el.request.name,
                    meta: {
                        ...item,
                        title: item.name
                    },
                    query: {
                        activePath: `${el.request.path}?${el.request.key}=${item[el.request.key]}`,
                        [el.request.key]: item[el.request.key]
                    },
                    path: `${el.request.path}?${el.request.key}=${item[el.request.key]}`
                }))
                el.meta.hideInMenu = false
            } else {
                el.meta.hideInMenu = true
            }
        }
    })
    // console.log(routes, 'routes')
    return routes.filter(_ => !_.meta.hideInMenu)
}
