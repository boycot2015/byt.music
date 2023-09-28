<template>
<div
    @dblclick="onExtend"
    class="header flexbox-h just-b">
    <div class="flexbox-h" @dblclick.prevent @dblclick.stop>
        <div class="logo">
            <router-link to="/" @click="goHome" class="flexbox-h">
                <div class="logo-icon icon-music-logo-icon"></div>
                <h3 class="logo-title">{{headerData.title}}</h3>
            </router-link>
        </div>
        <div class="back-forward tc flexbox-h">
            <div class="back-btn" @click="goBack">&lt;</div>
            <div class="forward-btn" @click="goForward">&gt;</div>
        </div>
    </div>
    <div class="weather flexbox-h just-b" style="cursor: pointer;" v-if="weathers.location" @click="() => $refs.weatherBox.showDialog()" @dblclick.prevent @dblclick.stop>
        <div class="city">{{weathers.location.name}}</div>
        <div class="text" v-if="weathers.now" style="margin:0 5px;">{{weathers.now.text}}</div>
        <div class="temperature" v-if="weathers.now">{{weathers.now.temperature}}℃</div>
    </div>
    <div class="search-box flexbox-h" @dblclick.prevent @dblclick.stop>
        <input type="text" v-model="searchForm.key" @keyup="onSearch" :placeholder="searchForm.placeholder">
        <div class="input-icon icon-music-search" ></div>
    </div>
    <div class="flexbox-h" @dblclick.prevent @dblclick.stop>
        <div class="user-info flex-4 tc just-c flexbox-h">
            <div class="wrap flexbox-h flex-1" @click.stop="showLogin = !showLogin">
                <div class="avatar ">
                    <img :src="headerData.avatar" alt="">
                </div>
                <div class="text name line-one">
                    <span class="name">{{headerData.username}}</span>
                    <i class="icon-music-drop-down"></i>
                </div>
            </div>
            <login-form class="login-box" @mousedown.stop ref="loginForm" v-if="showLogin && !hasLogin" @on-success="onLogin" @on-close="onLoginFormClose"></login-form>
            <user-info ref="userDialog" class="user-box" @mousedown.stop v-if="showLogin && hasLogin" @on-logout="onLogOut"></user-info>
            <!-- <span class="text vip-text">{{headerData.vipTxt}}</span> -->
            <!--  @click="showDialog"  -->
            <div class="text icon theme icon-music-clothes" @click="onThemeChange"></div>
            <div class="text icon message icon-music-msg"></div>
            <div class="text icon setting icon-music-setting"></div>
        </div>
        <div class="operation flex-1 align-c flexbox-h tc just-c">
            <i class="full-sreen-btn flex-1 fa icon-music-minus js-music-minus" title="最小化窗口" @click="onMinifty"></i>
            <i class="min-btn flex-1 icon-music-rectangle js-music-rectangle" title="全屏" v-if="ismini" @click="onExtend"></i>
            <i class="full-sreen-btn flex-1 icon-music-min js-music-min" title="退出全屏" v-else @click="onExtend"></i>
            <i class="close-btn flex-1 icon-music-close js-music-close" title="关闭窗口" @click="onBoxHide"></i>
        </div>
    </div>
    <weather ref="weatherBox" />
</div>
</template>

<script>
import {
    ref,
    // computed,
    watch,
    reactive,
    toRefs,
    onMounted,
    inject
    // getCurrentInstance
} from 'vue'
import {
    useRouter
} from 'vue-router'
import {
    useStore
} from 'vuex'
import loginForm from '@/views/components/login'
import userInfo from '@/views/components/userInfo'
import { changeTheme } from '@/utils'
import { apiUrl } from '@/api/baseUrl'
import axios from '@/api/axios'
export default {
    name: 'musicHeader',
    components: {
        loginForm,
        userInfo
    },
    setup (props, { emit }) {
        const loginForm = ref(null)
        const userDialog = ref(null)
        const store = useStore()
        const router = useRouter()
        const userInfo = store.state.user.userInfo
        const { profile = {}, account = {} } = userInfo
        const state = reactive({
            weathers: {},
            headerData: {
                title: '网抑云音乐',
                account,
                avatar: profile.avatarUrl || '',
                username: profile.nickname || '未登录',
                vipTxt: '开通VIP',
                profile
            },
            searchForm: {
                placeholder: '搜索音乐，视频，歌词，电台',
                key: router.currentRoute.value.query.keywords || ''
            },
            ismini: true,
            showLogin: false,
            hasLogin: store.state.user.cookie || false
        })
        const getWeather = () => {
            axios.get(`${apiUrl}/weather`, { params: { location: '深圳' } })
                .then(res => {
                    if (!res.success) return
                    state.weathers = res.data
                })
        }
        onMounted(() => {
            getWeather()
            document.addEventListener('click', (e) => {
                if (loginForm.value !== null && !loginForm.value.$el.contains(e.target)) {
                    state.showLogin = false
                }
                if (userDialog.value !== null && !userDialog.value.$el.contains(e.target)) {
                    state.showLogin = false
                }
            })
        })
        watch(() => store.state.user.userInfo, (value) => {
            value && state.userInfo && (state.userInfo = value)
        })
        watch(() => store.state.user.userInfo.profile, (value) => {
            if (value) {
                state.headerData.avatar = value.avatarUrl
                state.headerData.username = value.nickname
                state.headerData.profile = value
                state.hasLogin = true
            }
        })
        const onMinifty = () => {
            window.electron && window.electron.toggleMini({ value: true })
            if (window.electron) return window.electron.toggleMinMax(true)
            emit('on-minify', true)
        }
        const onBoxHide = () => {
            if (window.electron) return window.electron.toggleShow(true)
            emit('on-hide', true)
        }
        const goHome = () => {
            router.push({ path: '/', query: { tabName: 'home' } })
            document.querySelector('#play-video').pause()
            store.dispatch('video/setVideoPlayerShow', false)
            store.dispatch('detail/setSongPlayerShow', false)
        }
        const goBack = () => {
            router.back()
            store.dispatch('video/setVideoPlayerShow', false)
            store.dispatch('detail/setSongPlayerShow', false)
        }
        const goForward = () => {
            router.forward()
            store.dispatch('video/setVideoPlayerShow', false)
            store.dispatch('detail/setSongPlayerShow', false)
        }
        const onExtend = () => {
            state.ismini = !state.ismini
            emit('on-extend', !state.ismini)
            if (window.electron) window.electron.toggleFullScreen(!state.ismini)
        }
        const onLoginFormClose = (val) => {
            state.showLogin = false
        }
        const onLogin = (val) => {
            state.hasLogin = true
            state.showLogin = false
        }
        const onLogOut = (val) => {
            state.hasLogin = false
            state.showLogin = false
            state.headerData.username = '未登录'
            state.headerData.avatar = ''
        }
        const onSearch = (e) => {
            // console.log(e, state.searchForm.key, 'state.searchForm.key')
            if (e.keyCode === 13 && state.searchForm.key) {
                router.push({
                    path: '/songs/list',
                    query: {
                        keywords: state.searchForm.key
                    }
                })
            }
        }
        const MessageBox = inject('messageBox')
        const showDialog = () => {
            const $el = MessageBox({
                content: '<div>这里是内容信息！</div>',
                shadeClose: false,
                btns: [
                    { text: '取消', click: () => { $el.close() } },
                    { text: '确认', class: 'btn-primary', click: () => { $el.close() } }
                ]
            })
        }
        const onThemeChange = (e) => {
            if (window.electron) {
                emit('on-theme-change', true)
                return
            }
            changeTheme(e)
            store.dispatch('themeChanged', !store.state.themeChanged)
        }
        return {
            router,
            loginForm,
            userDialog,
            onBoxHide,
            goHome,
            goBack,
            goForward,
            onExtend,
            onMinifty,
            onLoginFormClose,
            onLogin,
            onLogOut,
            onSearch,
            showDialog,
            onThemeChange,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="less" scoped>
.user-box,.login-box {
    position: absolute;
    top: 36px;
    left: -80px;
    z-index: 10000;
    box-shadow: 0 0px 5px @c-ccc;
    border-radius: 4px;
    &::after {
        content: '';
        position: absolute;
        top: -20px;
        left: 50%;
        height: 0;
        margin-left: -10px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent @white transparent;
    }
}
</style>
