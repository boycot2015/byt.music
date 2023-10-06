<template>
<div class="music-client flexbox-h align-c just-c" @click.prevent="!microApp && (showThemeDialog=false)">
    <div
    :style="{
        width: isExtend ? '100%': '',
        height: isExtend ? '100%': '',
        left: isExtend ? '0px': '',
        top: isExtend ? '0px': '',
    }"
    @dblclick.stop
    class="music-box js-music-box flexbox-v"
    :class="{'is-micro-app': microApp}"
    ref="dragBox" v-show="!showMiniBox && showBox">
        <music-header
        @on-minify="() => {
            showMiniBox = true;
        }"
        @on-hide="() => {
            showBox = false
            showMiniBox = true
        }"
        @on-extend="(val) => onExtend(val)"
        @on-theme-change="onThemeShow"
        ></music-header>
        <div class="center flexbox-h"
            @dblclick.stop="() => {
                showMiniBox = true
                showBox = false
            }"
            :style="{
                height: `calc(100% - ${showFooter && !showVideoPlayer ? 100 : 50}px)`
            }">
                <!-- :class="{'isClose': !showMenu}" -->
                <music-aside :class="{'isClose': !showMenu}" @hideMenu="goDetail"></music-aside>
            <div
            :style="{
                width: isExtend ? '1020px': '',
                flex: isExtend ? 'none': '',
                margin: isExtend ? '0 auto': ''
            }"
            class="main flex-1 flexbox-v" ref="mainDom" @dblclick.stop>
                <router-view v-slot="{ Component }">
                    <transition name="slide-fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
            <to-top selector=".main" v-if="!showSongPlayer && !showVideoPlayer"></to-top>
            <audio-player-box :class="{show: showSongPlayer, hide: !showSongPlayer}"></audio-player-box>
            <video-player-box :class="{show: showVideoPlayer, hide: !showVideoPlayer}"></video-player-box>
        </div>
        <music-footer v-if="showFooter && !showVideoPlayer" @show-lyirc="toggleLyirc"></music-footer>
    </div>
    <div
    @dblclick.stop="() => {
        showMiniBox = false
        showBox = true
    }"
    :style="{
        top: !showBox ? 0: ''
    }"
    :class="{'is-micro-app': microApp}"
    class="mini-music-box js-mini-music-box flexbox-v"
    v-show="showMiniBox" ref="dragMiniBox">
        <div class="wrap flexbox-h just-b">
            <div class="left flex-2 flexbox-h just-b"
            @mouseout.stop.prevent="showPlayer = false"
            @mouseover.stop.prevent="showPlayer = true"
            >
                <div class="img tl" @mouseover.stop>
                    <img :src="playData.picUrl" alt="">
                </div>
                <div class="name tc">
                    <div class="text" ref="textMoveDom" v-if="currLyric && currLyric!==null">{{playData.paused ? playData.name : currLyric.text }}</div>
                    <span v-show="playData.paused" class="name tc">{{playData.singer}}</span>
                </div>
                <div class="play-btn js-play-btn flexbox-h just-a"
                :class="{'active': showPlayer}">
                    <i class="icon-music-play-left"
                    @click.stop="playPrev"></i>
                    <i class="icon-play js-play"
                    :class="{
                        'icon-music-pause': playData.paused,
                        'icon-music-play': !playData.paused,
                        }"
                        @click.stop="toggleAudioPlay"></i>
                    <i class="icon-music-play-right"
                    @click.stop="playNext"></i>
                </div>
                <div class="more js-more text"
                :class="{'active': showPlayer}">
                    <div class="wrap flexbox-h tc just-c">
                        <p class="name line-one">{{playData.name}}</p>
                        <span class="line"> - </span>
                        <span class="singer line-one">{{playData.singer}}</span>
                    </div>
                </div>
            </div>
            <div class="right flex-1 flexbox-h just-b">
                <span class="js-love-icon love-icon icon-music-love"></span>
                <span class="js-love-clothes clothes-icon icon-music-clothes" @click.stop="onThemeShow"></span>
                <span class="volume-icon icon-music-volume js-min-music-volume" @click="showVolume = !showVolume"></span>
                <span class="list-icon icon-music-list js-list-icon" @click="showList = !showList"></span>
                <div class="volume flex-2 flexbox-h just-b tc" v-show="showVolume" @click="onSetVolumeClick">
                    <!-- <i class="icon-music-volume js-music-volume flex-1"></i> -->
                    <div class="progress-bar flex-4">
                        <span class="point" ref="progressVolumeDom"></span>
                        <span class="line js-line" :style="{width: audioVolumePos.w + 'px' || ''}"></span>
                    </div>
                    <!-- <i class="heart-icon icon-music-beckoning flex-1"></i> -->
                </div>
            </div>
            <!-- <div class="text flex-3 flexbox-h just-b">
                </div> -->
        </div>
        <div class="more js-mini-music-list"
        :class="{'actived': showList}">
            <ul class="music-list js-music-list">
                <list
                @dblclick.stop="onListItemdbClick(item)"
                @click="() => activeIndex = index"
                v-for="(item, index) in playList.data"
                :class="{
                    'active': activeIndex === index,
                    'play': playIndex === index && !playData.paused,
                    'pause': playIndex === index && playData.paused
                    }"
                :data="item"
                isminiPlay
                :index="index"
                :operation="false"
                :order="false"
                :key="index"></list>
            </ul>
        </div>
    </div>
    <!-- /src/source/前世今生-文武贝钢琴版.mp3 -->
    <audio id="play-audio" crossOrigin="anonymous" controls="controls"></audio>
    <!-- <video id="play-audio" controls="controls"></video> -->
    <!-- 桌面图标 -->
    <!-- <desk-top></desk-top> -->
    <!-- 桌面歌词 -->
    <lyric v-model:isShow="showLyirc"></lyric>
    <Theme ref="dialogRef" @close-modal="showThemeDialog = false" :class="{active: showThemeDialog}"></Theme>
    <template v-if="!microApp">
        <!-- <weather ref="weatherBox" /> -->
        <!-- 自定义右键菜单 -->
        <context-menu @on-menu-click="(type) => type === 'setting' && (showThemeDialog = true)"></context-menu>
        <div class="change-theme-btn" :class="{hide: showThemeDialog, show: !showThemeDialog}" @dblclick.stop="changeTheme" ref="dragthemeBox" @click.stop="onThemeShow"></div>
    </template>
</div>
</template>

<script>
import musicHeader from './header'
import musicAside from './aside'
import musicFooter from './footer'
import videoPlayerBox from '../video/detail'
import audioPlayerBox from '../songs/detail'
import List from '@/views/components/List'
import Theme from '@/views/components/Theme'
import {
    ref,
    computed,
    watch,
    reactive,
    onMounted,
    onUpdated,
    toRefs, onBeforeMount
    // getCurrentInstance
} from 'vue'
import {
    useStore
} from 'vuex'
import {
    useRouter
} from 'vue-router'
import { drag, changeTheme, store } from '@/utils'
const localStore = store
export default {
    name: 'layout',
    components: {
        musicHeader,
        musicAside,
        musicFooter,
        List,
        videoPlayerBox,
        audioPlayerBox,
        Theme
    },
    emits: {
        hideMenu: val => {
            // console.log(val, 'valvalvalval')
            return true
        },
        closeModal: val => {
            // console.log(val, 'valvalvalval')
            return true
        }
    },
    setup (props, context) {
        const store = useStore()
        const storeState = store.state
        const router = useRouter()
        const progressVolumeDom = ref(null)
        const mainDom = ref(null)
        const state = reactive({
            weathers: {},
            microApp: false,
            showLyirc: false,
            isNight: false,
            playData: {
                lyrc: '一诺千金到尽头',
                name: '菩提偈',
                singer: '刘惜君',
                ...computed(() => storeState.playData)
            },
            currLyric: storeState.detail.songDetail.currLyric || {
                time: '00:01',
                text: '纯音乐，请欣赏~'
            },
            playList: {
                data: storeState.playList || []
            },
            audioVolumePos: {
                l: -4,
                t: -6,
                r: 84,
                b: -4,
                w: 20
            },
            boxPos: {
                min: {
                    left: 0,
                    top: 0
                },
                max: {
                    left: 0,
                    top: 0
                }
            },
            themeBarPos: {
                t: 0,
                b: 0
            },
            showThemeDialog: false,
            picIndex: 0,
            colorIndex: 0,
            colors: [],
            localBgUrls: [],
            progressPsition: '',
            playIndex: storeState.playData.playIndex,
            activeIndex: 0,
            showMenu: true,
            showBox: true,
            showMiniBox: false,
            isExtend: false,
            showPlayer: false,
            showList: false,
            isBoxMoved: false,
            isMinBoxMoved: false,
            showVolume: false,
            showFooter: true,
            showVideoPlayer: false,
            showSongPlayer: false
        })
        const dragBox = ref(null)
        const dragMiniBox = ref(null)
        const dragthemeBox = ref(null)
        const textMoveDom = ref(null)
        // const weatherBox = ref(null)
        let audio = null
        // const { ctx } = getCurrentInstance()
        watch(() => {
            return router.currentRoute.value
        }, (value, old) => {
            if (value.path !== old.path) {
                mainDom.value.scrollTo(0, 0)
            }
        })
        watch(() => {
            return router.currentRoute.value
        }, (value) => {
            if (value.meta.hideMenu) {
                store.commit('showMenu', false)
            } else {
                store.commit('showMenu', true)
            }
            if (value.meta.hideFooter) {
                state.showFooter = false
            } else {
                state.showFooter = true
            }
        })
        watch(() => storeState.showMenu, (value) => {
            state.showMenu = value
        })
        watch(() => storeState.video.showVideoPlayer, (value) => {
            state.showVideoPlayer = value
        })
        watch(() => storeState.detail.showSongPlayer, (value) => {
            state.showSongPlayer = value
        })
        watch(() => storeState.detail.songDetail.currLyric, (value) => {
            state.currLyric = value
            let w = state.currLyric.text.length * 12
            w = w < 100 ? 100 : w
            if (textMoveDom.value !== null) {
                textMoveDom.value.style.left = 0
                textMoveDom.value.style.width = w + 'px'
                setTimeout(() => {
                    clearInterval(textMoveDom.value._move)
                    textMove(textMoveDom.value)
                }, 1000)
            }
        })
        watch(() => storeState.playList, (value) => {
            // console.log(value, 'storeStatestoreStatestoreState')
            state.playList.data = value
        })
        watch(() => storeState.playData.playIndex, (value) => {
            state.playIndex = value || 0
        })
        onBeforeMount(() => {
            // state.showMenu = !router.currentRoute.value.meta.hideMenu
            state.showFooter = !router.currentRoute.value.meta.hideFooter
        })
        onMounted(() => {
            state.microApp = window.microApp || !!window.electron
            drag({
                obj: [dragBox.value.children[0]],
                target: [dragBox.value],
                cancelElem: ['.search-box'],
                fn (pos) {
                    // console.log(pos, 'pos')
                    state.isBoxMoved = true
                    state.boxPos.max = pos
                }
            })
            !state.microApp && drag({
                obj: [dragMiniBox.value],
                cancelElem: ['.js-mini-music-list', '.volume'],
                fn (pos) {
                    // console.log(pos, 'pos')
                    state.isMinBoxMoved = true
                    state.boxPos.min = pos
                },
                end (pos) {
                    // console.log(pos, 'pos1')
                }
            })
            drag({
                obj: [progressVolumeDom.value],
                site: state.audioVolumePos,
                fn (obj) {
                    state.isMove = true
                    setVolume(obj)
                },
                end (obj) {
                    setTimeout(() => {
                        state.isMove = false
                    }, 300)
                }
            })
            window.addEventListener('resize', (e) => {
                drag({
                    obj: [dragBox.value.children[0]],
                    target: [dragBox.value],
                    cancelElem: ['.search-box']
                })
                !state.microApp && drag({
                    obj: [dragMiniBox.value],
                    cancelElem: ['.js-mini-music-list', '.volume']
                })
                // drag({
                //     obj: [weatherBox.value.$el],
                //     target: [weatherBox.value.$el]
                // })
            })
            audio = document.getElementById('play-audio')
            textMove(textMoveDom.value)
            drag({
                obj: [dragthemeBox.value],
                target: [dragthemeBox.value],
                site: state.themeBarPos,
                cancelElem: [],
                fn (pos) {
                    // console.log(pos, 'pos')
                }
            })
            // drag({
            //     obj: [weatherBox.value.$el],
            //     target: [weatherBox.value.$el]
            // })
            changeTheme().then(res => {
                state.picIndex = res.bgUrlIndex
                state.colorIndex = res.colorIndex
                state.localBgUrls = res.bgUrlList
                state.colors = res.colors
                store.dispatch('themeChanged', !store.state.themeChanged)
            })
            state.currLyric = localStore.get('currLyric')
            // console.log(state.currLyric, 'state.currLyric')
            if (state.microApp) {
                document.body.style.overflow = 'hidden'
            }
            window.electron && window.electron.playSong({ currLyric: JSON.stringify(store.state.detail.songDetail.currLyric), playData: JSON.stringify(state.playData), lyricStyle: JSON.stringify(localStore.get('fontStyles')) })
        })
        onUpdated(() => {
            // 处理
            if (state.isBoxMoved) {
                dragBox.value.style.left = state.boxPos.max.left + 'px'
                dragBox.value.style.top = state.boxPos.max.top + 'px'
            }
            if (state.isMinBoxMoved && !state.microApp) {
                dragMiniBox.value.style.left = state.boxPos.min.left + 'px'
                dragMiniBox.value.style.top = state.boxPos.min.top + 'px'
            }
        })
        const goDetail = (val) => {
            document.getElementById('play-video').pause()
            store.dispatch('detail/setSongPlayerShow', true)
        }
        const onExtend = (val) => {
            state.isExtend = val
            handleFullScreen()
        }
        // 全屏事件
        const handleFullScreen = () => {
            const element = document.documentElement
            // 判断是否已经是全屏
            // 如果是全屏，退出
            if (!state.isExtend) {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
                state.isExtend = false
                console.log('已还原！')
            } else { // 否则，进入全屏
                if (element.requestFullscreen) {
                    element.requestFullscreen()
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen()
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen()
                } else if (element.msRequestFullscreen) {
                // IE11
                    element.msRequestFullscreen()
                }
                console.log('已全屏！')
            }
            store.commit('setExtend', state.isExtend)
        }
        const onListItemdbClick = (item) => {
            state.playList.data.map((el, index) => {
                if (item.id === el.id) {
                    state.playIndex = index
                }
            })
            store.dispatch('setPlayList', state.playList.data).then(res => {
                store.dispatch('setPlayData', { ...item, playIndex: state.playIndex }).then(res => {
                    if (res.code === 0) {
                        state.playIndex++
                        if (!state.playList.data[state.playIndex]) return
                        store.dispatch('setPlayData', { ...state.playList.data[state.playIndex], playIndex: state.playIndex })
                    }
                })
            })
        }
        const toggleAudioPlay = () => {
            if (!state.playData.url) return
            textMoveDom.value.style.width = '100px'
            textMoveDom.value.style.left = '0px'
            store.dispatch('toggleAudioPlay', { audio, state })
            // window.electron && window.electron.playSong({ currLyric: JSON.stringify(store.state.detail.songDetail.currLyric), playData: JSON.stringify(state.playData) })
        }
        const toggleAudioMouted = () => {
            store.dispatch('toggleAudioMouted', { audio, state }).then(res => {})
        }
        const playPrev = () => {
            state.playIndex--
            if (state.playIndex < 1) {
                state.playIndex = 0
                return
            }
            store.dispatch('playPrev', state)
            // window.electron && window.electron.playSong({ currLyric: JSON.stringify(store.state.detail.songDetail.currLyric), playData: JSON.stringify(state.playData) })
        }
        const playNext = () => {
            state.playIndex++
            if (state.playIndex > state.playList.data.length - 1) {
                state.playIndex = state.playList.data.length - 1
                return
            }
            store.dispatch('playNext', state)
            // window.electron && window.electron.playSong({ currLyric: JSON.stringify(store.state.detail.songDetail.currLyric), playData: JSON.stringify(state.playData) })
        }
        const textMove = (oCon) => {
            if (oCon && oCon !== null) {
                oCon._move = null
                const step = -1
                if (oCon.textContent.length <= 8) {
                    clearInterval(oCon._move)
                    return
                } else {
                    // oCon.textContent += '' + oCon.textContent
                    autoRoll(oCon, step)
                }
                oCon._move = setInterval(() => {
                    autoRoll(oCon, step)
                }, 30)
            }
        }
        const autoRoll = (oCon, step) => {
            if (oCon.offsetLeft < -oCon.offsetWidth + 100) {
                oCon.style.left = -oCon.offsetWidth + 100
                clearInterval(oCon._move)
            }
            if (oCon.offsetLeft > 0) {
                oCon.style.left = -oCon.offsetWidth / 2 + 'px'
            }
            oCon.style.left = oCon.offsetLeft + step + 'px'
        }
        const setVolume = (obj) => {
            if (!progressVolumeDom.value && audio !== null) return
            let volume = state.playData.volume
            let left = volume * 100
            if (obj) {
                left = obj.left || obj.offsetX || 0
                left = left > 8 ? left + 8 : left
                if (obj.offsetX) {
                    progressVolumeDom.value.style.left = left + 'px'
                }
                volume = Math.abs(left / progressVolumeDom.value.parentNode.offsetWidth).toFixed(1)
                volume = volume > 1 ? 1 : volume
            } else {
                left = left > 8 ? left - 8 : left
            }
            if (left === 0) {
                state.audioVolumePos.w = 0
                progressVolumeDom.value.style.left = '-8px'
                return
            }
            audio.muted = false
            progressVolumeDom.value.style.left = left + 'px'
            state.audioVolumePos.w = left
            state.progressPsition = left > 8 ? left - 8 : left
            audio.volume = volume
            state.playData.volume = volume
            // console.log(audio.volume, state.progressPsition, 'setVolume')
            store.commit('setAudio', { volume })
        }
        const onSetVolumeClick = (e) => {
            !state.isMove && setVolume(e)
        }
        const onThemeShow = () => {
            state.showThemeDialog = !state.showThemeDialog
        }
        const toggleLyirc = (val) => {
            if (window.electron) return window.electron.toggleLyric(val)
            state.showLyirc = val
        }
        return {
            dragBox,
            dragMiniBox,
            textMoveDom,
            progressVolumeDom,
            mainDom,
            goDetail,
            onExtend,
            onListItemdbClick,
            onSetVolumeClick,
            toggleAudioPlay,
            toggleAudioMouted,
            playPrev,
            playNext,
            textMove,
            changeTheme,
            dragthemeBox,
            // weatherBox,
            onThemeShow,
            toggleLyirc,
            // ...computed(() => storeState).value,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="less">
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
    /* transform: translate(-100px); */
    transition: all 0.3s ease-in-out;
     opacity: 0;
}

.slide-fade-leave-active {
    /* cubic-bezier(1, 0.5, 0.8, 1) */
    transition: all 0.3s ease-in-out;
    opacity: 0;
}
.slide-fade-enter-to ,.slide-fade-leave-to {
    transform: translate(0px);
    opacity: 1;
}
.change-theme-btn {
    position: fixed;
    top: 0px;
    z-index: 100000;
    right: 200px;
    width: 32px;
    font-size: 16px;
    color: @white;
    cursor: pointer;
    transition: transform 0.3s;
    &.active {
         &:before {
            height: 50px;
         }
    }
    &.hide {
        transform: translateY(-200px);
    }
    &.show {
        transform: translateY(0px);
    }
    &:before {
        position: relative;
        left: 50%;
        margin-left: -2px;
        content: "";
        height: 40px;
        width: 4px;
        display: inline-block;
        z-index: 9;
        background: @white;
        transform: all 0.3s;
        border-radius: 3px;
    }
    &:after {
        content: "换主题";
        line-height: 14px;
        padding: 10px 8px;
        top: -5px;
        line-height: 20px;
        position: relative;
        z-index: 10;
        background: @primary;
        box-shadow: 0 0 10px @c-ccc;
        border-radius: 3px;
        display: block;
    }
}
.music-box.is-micro-app {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    position: fixed!important;
    top: 0!important;
    left: 0!important;
    right: 0!important;
    bottom: 0!important;
}
</style>
