<template>
    <div class="footer flexbox-h just-b">
        <div class="play-btn flexbox-h just-a">
            <i class="icon-music-play-left" @click="playPrev"></i>
            <i class="js-play"
            :class="{
                'icon-music-play': !playData.paused,
                'icon-music-pause': playData.paused
                }"
            @click="toggleAudioPlay()"></i>
            <i class="icon-music-play-right" @click="playNext"></i>
        </div>
        <div class="flexbox-h flex-1 just-b">
            <div class="progress flex-3 flexbox-h just-c">
                <span class="start-time tl">{{playData.curStr}}</span>
                <div class="progress-bar tc flex-4" @click="onSetTimerClick">
                     <!-- @click.stop="setTimer" -->
                    <span class="point" ref="progressTimeDom"></span>
                    <span class="line js-line" :style="{width: audioTimePos.w + 'px' || ''}"></span>
                </div>
                <span class="end-time tr">{{playData.endStr}}</span>
            </div>
            <div
            class="volume flex-1 flexbox-h just-c tc"
            @mouseleave="showVolumeBtn = false"
            @mouseenter="showVolumeBtn = true">
                <i class="icon-music-volume js-music-volume" :class="{'close': playData.muted}" @click="toggleAudioMouted"></i>
                <div class="progress-bar flex-4" @click="onSetVolumeClick">
                    <!-- @click.stop="setVolume" -->
                    <span class="point" v-show="showVolumeBtn" ref="progressVolumeDom"></span>
                    <span class="line js-line" :style="{width: audioVolumePos.w + 'px' || ''}"></span>
                </div>
            </div>
        </div>
        <div class="others flex-1 flexbox-h just-b">
            <!-- icon-music-beckoning-->
            <i class="order-icon" :class="{
                'icon-music-loop-one': playData.loop,
                'icon-music-loop': !playData.loop,
                'icon-music-loop-random': !!playData.random,
            }" @click="toggleLoop()"></i>
            <!-- <i class="type">标准</i> -->
            <i class="new love-icon icon-music-love" :class="playData.liked && 'icon-music-love-full'" @click="collect"></i>
            <i class="word" @click="() => {$emit('show-lyirc', !showLyirc);showLyirc = !showLyirc;}">词</i>
            <i class="icon js-play-list-btn icon-music-play-list" @click.stop="showList = !showList"></i>
            <div class="play-list js-play-list" v-show="showList">
                <div class="title flexbox-h just-c">
                    <div class="btn tc flex-1 flexbox-h just-c">
                        <span class="active js-list-btn list-btn">播放列表</span>
                        <span class="js-history-btn history-btn">历史记录</span>
                    </div>
                    <i class="tr js-list-close icon-close icon-music-close" @click="showList = false"></i>
                </div>
                <div class="list-header flexbox-h just-b">
                    <div class="total tl">
                        <span class="num">总<span>{{playList.total}}</span>首</span>
                        <span class="icon-music-info"></span>
                    </div>
                    <div class="operation">
                        <span class="icon-music-collect">收藏全部</span>
                        <span class="line">|</span>
                        <span class="icon-music-delete">清空</span>
                    </div>
                </div>
                <div class="wrap" >
                    <ul class="music-list js-footer-music-list song-list" @dblclick.prevent @dblclick.stop>
                        <list
                        @click.stop
                        @dblclick="() => {onListItemdbClick(item);activeIndex = index}"
                        v-for="(item, index) in playList.data"
                        :class="{
                            'active': activeIndex === index,
                            'play': playIndex === index && !playData.paused,
                            'pause': playIndex === index && playData.paused
                            }"
                        :data="item"
                        :index="index"
                        :operation="false"
                        :order="false"
                        :key="index"></list>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    ref,
    computed,
    watch,
    reactive,
    toRefs,
    onMounted,
    inject
    // getCurrentInstance
} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { drag } from '@/utils'
import List from '@/views/components/List'
import { song } from '@/api/apiList'
export default {
    name: 'musicFooter',
    // props: {
    //     showLyirc: {
    //         type: Boolean,
    //         default: false
    //     }
    // },
    components: {
        List
    },
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            playData: {
                lyrc: '一诺千金到尽头',
                name: '菩提偈',
                singer: '刘惜君',
                picUrl: require('@/assets/images/avatar.jpg'),
                startTime: '00:00',
                endTime: '00:00',
                type: '标准',
                isHot: 'new',
                lyrcTxt: '词',
                ended: false,
                muted: false,
                loop: false,
                random: false,
                curStr: '00:00',
                endStr: '00:00',
                duration: 0,
                volume: 0.2,
                currentTime: '00:00',
                paused: true,
                liked: false,
                ...computed(() => store.state.playData)
            },
            playList: {
                data: [],
                total: 0
            },
            audioTimePos: {
                l: -4,
                t: -6,
                r: 372,
                b: -4,
                w: 0
            },
            audioVolumePos: {
                l: -4,
                t: -6,
                r: 84,
                b: -4,
                w: 20
            },
            isMove: false, // 拖动与点击事件隔离
            showVolumeBtn: false,
            progressPsition: '', // 进度条位置
            activeIndex: 0,
            playIndex: store.state.playData.playIndex || 0,
            showList: false,
            showLyirc: false,
            changeTimes: 0
        })
        let audio = null
        const progressTimeDom = ref(null)
        const progressVolumeDom = ref(null)
        state.playList.data = store.state.playList
        state.playList.total = store.state.playList.length
        watch(() => store.state.playData.url, (value) => {
            audio.src = value || null
            state.playData.url = value || null
            state.playData.paused = false
            progressTimeDom.value.style.left = '-3px'
            state.progressPsition = state.playData.volume * 100
            initPlayer(audio, setTimerStatus, setVolume)
            playAudio()
        })
        watch(() => store.state.playData.playIndex, (value) => {
            state.playIndex = value || 0
        })
        watch(() => store.state.playList, (value) => {
            state.playList.data = value
            state.playList.data.total = value.length
        })
        watch(() => state.playData.paused, (value) => {
            window.electron && window.electron.thumbarButtons({ value: !value })
        })
        onMounted(() => {
            drag({
                obj: [progressTimeDom.value],
                site: state.audioTimePos,
                fn (obj) {
                    audio.pause()
                    state.isMove = true
                    audio.currentTime = obj.left / progressTimeDom.value.parentNode.offsetWidth * state.playData.duration
                    state.playData.currentTime = parseInt(audio.currentTime)
                    setTimer(obj)
                },
                end (obj) {
                    !state.playData.paused && audio.src && audio.play()
                    setTimeout(() => {
                        state.isMove = false
                    }, 300)
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
            audio = document.getElementById('play-audio')
            audio.src = state.playData.url || null
            state.playData.paused = true
            state.progressPsition = store.state.playData.volume * 100
            // store.commit('setAudio', { paused: true, currentTime: 0 })
            initPlayer(audio, setTimerStatus, setVolume)
            /* eslint-disable */
            // audio = new AudioPlayer({ ...state, el: audio })
            document.addEventListener('click', (e) => {
                const playListDom = document.querySelector('.js-footer-music-list')
                if (playListDom !==null && !playListDom.contains(e.target)) {
                    state.showList = false
                }
            })
            window.electronAPI && window.electronAPI.onPrevPlay((e, data) => {
                playPrev()
            })
            window.electronAPI && window.electronAPI.onNextPlay((e, data) => {
                playNext()
            })
            window.electronAPI && window.electronAPI.onTogglePlay((e, data) => {
                toggleAudioPlay(data.value)
            })
            window.electronAPI && window.electronAPI.onPlaySong((e, data) => {
                !data.playData && playAudio()
            })
        })
        const getAudioInfo = (_audio, call) => {
            var time = _audio.duration || 0
            var min = parseInt(time / 60)
            var second = parseInt(time % 60)
            var currentTime = _audio.currentTime
            var duration = min * 60 + second
            min = min < 10 ? '0' + min : min
            second = second < 10 ? '0' + second : second
            var endStr = min + ':' + second
            min = Math.round(currentTime) > 59 ? (Math.round(currentTime / 60) < 10 ? ('0' + parseInt(currentTime / 60)) : Math.round(currentTime / 60)) : '00'
            second = parseInt(currentTime % 60) < 10 ? ('0' + parseInt(currentTime % 60)) : parseInt(currentTime % 60)
            second = second === 60 ? '00' : second
            var curStr = min + ':' + second
            // state.playData.src = _audio.src
            // _audio.volume = state.playData.volume
            state.playData.ended = _audio.ended
            state.playData.muted = _audio.muted
            state.playData.curStr = curStr
            state.playData.endStr = endStr
            state.playData.duration = duration
            state.playData.currentTime = parseInt(currentTime)
            if (call) call({ currentTime: parseInt(currentTime), curStr, endStr, duration })
        }
        const initPlayer = (audioPlayer, setStatus, setVolume) => {
            // 进度事件监听
            audioPlayer.addEventListener('timeupdate', function () {
                getAudioInfo(audioPlayer, setStatus)
            })
            // 加载事件监听
            audioPlayer.addEventListener('loadedmetadata', function () {
                setVolume()
                getAudioInfo(audioPlayer, setStatus)
            })
            // 结束事件监听
            audioPlayer.addEventListener('ended', function () {
                getAudioInfo(audioPlayer, setStatus)
                clearInterval(state.playData.timer)
                if (audio.ended) {
                    if (!state.playData.loop && state.playIndex < state.playList.data.length - 1) {
                        playNext()
                    } else {
                        state.playData.paused = true
                    }
                }
            })
        }
        const playAudio = () => {
            if (!state.playData.url || state.playData.url === null) {
                state.playData.paused = true
                return
            }
            audio.src = state.playData.url
            state.playData.paused = false
            audio.play()
        }
        const toggleAudioPlay = (value) => {
            if (!state.playData.url) return
            store.dispatch('toggleAudioPlay', { audio, state })
        }
        const toggleAudioMouted = () => {
            store.dispatch('toggleAudioMouted', { audio, state }).then(res => {
                audio.muted ? setVolume({left: 0}) : setVolume({ left: state.progressPsition })
            })
        }
        const playPrev = () => {
            state.playIndex--
            state.onPlayCount--
            if (state.playData.random) {
                state.playIndex = Math.floor(Math.random() * state.playList.data.length - 1)
            }
            if (state.playIndex < 1) {
                state.playIndex = 0
                return
            }
            store.dispatch('playPrev', state)
            window.electron && window.electron.playSong({ currLyric: JSON.stringify(store.state.detail.songDetail.currLyric), playData: JSON.stringify(state.playData) })
        }
        const playNext = () => {
            if (state.playIndex >= state.playList.data.length - 1) {
                state.playIndex = state.playList.data.length - 1
                return
            }
            state.playIndex++
            if (state.playData.random) {
                state.playIndex = Math.floor(Math.random() * state.playList.data.length - 1)
            }
            store.dispatch('playNext', state)
            window.electron && window.electron.playSong({ currLyric: JSON.stringify(store.state.detail.songDetail.currLyric), playData: JSON.stringify(state.playData) })
        }

        const toggleLoop = () => {
            state.playData.random = false
            state.changeTimes++
            if (state.changeTimes > 2) {
                state.changeTimes = 0
                state.playData.random = true
                state.playData.loop = false
            } else {
                state.playData.loop = !state.playData.loop
            }
            let aduio = document.querySelector('#play-audio')
            aduio.loop = state.playData.loop
            store.commit('setAudio', { loop: state.playData.loop, random: state.playData.random })
        }

        const setTimerStatus = ({ currentTime, curStr, endStr, duration }) => {
            if (!progressTimeDom.value) return
            let left = 0
            const w = progressTimeDom.value.parentNode.offsetWidth
            duration = duration || 1
            left = currentTime * w / duration
            left = Math.abs(left)
            left = left > w - 8 ? w - 8 : left
            setTimer({ left, offsetX: left })
            store.dispatch('detail/setCurrentLyric', curStr).then(data => {
                window.electron && window.electron.playSong({ currLyric: JSON.stringify(store.state.detail.songDetail.currLyric), playData: JSON.stringify(state.playData) })
            })
        }
        const setTimer = (obj) => {
            if (obj.offsetX) {
                progressTimeDom.value.style.left = obj.offsetX - 3 + 'px'
            }
            state.audioTimePos.w = obj.left || obj.offsetX || 0
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
        const onSetTimerClick = (e) => {
            if (!progressTimeDom.value || state.isMove) return
            audio.pause()
            audio.currentTime = (e.offsetX / progressTimeDom.value.parentNode.offsetWidth * state.playData.duration)
            !state.isMove && setTimer(e)
            !state.playData.paused && !state.isMove && audio.play()
        }
        const onSetVolumeClick = (e) => {
            !state.isMove && setVolume(e)
        }
        const onListItemdbClick = (item) => {
            state.playList.data.map((el, index) => {
                if (item.id === el.id) {
                    state.playIndex = index
                    playAll(item)
                    store.dispatch('detail/setSongPlayer', {
                        id: item.id || item.vid || item.mvid,
                        show: true
                    })
                }
            })

        }
        const playAll = (item) => {
            store.dispatch('setPlayList', state.playList.data).then(res => {
                store.dispatch('setPlayData', { ...item, playIndex: state.playIndex }).then(res => {
                    if (res.code === 0) {
                        state.playIndex++
                        if (!state.playList.data[state.playIndex]) return
                        store.dispatch('setPlayData', { ...state.playList.data[state.playIndex], playIndex: state.playIndex })
                    }
                    if (router.currentRoute.value.path === '/songs/detail') {
                         router.push({
                            path: '/songs/detail',
                            query: {
                                id: state.playList.data[state.playIndex].id
                            }
                        })
                        store.dispatch('detail/getData', state.playList.data[state.playIndex])
                    }
                })
            })
        }
        // 收藏/取消歌单
        const showToast = inject('showToast')
        const collect = () => {
            song.like({ id: state.playData.id }).then(res => {
                showToast({
                    text: res.message || `${state.playData.liked ? '取消':'收藏'}${res.code === 200 ? '成功':'失败'}！`,
                    showWrap: true, // 是否显示组件
                    showContent: true // 作用:在隐藏组件之前,显示隐藏动画
                })
                state.playData.liked = !state.playData.liked
            }).catch(err => {})
        }
        return {
            ...toRefs(state),
            progressTimeDom,
            progressVolumeDom,
            setVolume,
            setTimer,
            onSetTimerClick,
            onSetVolumeClick,
            toggleAudioPlay,
            toggleAudioMouted,
            playPrev,
            playNext,
            collect,
            toggleLoop,
            onListItemdbClick
        }
    }
}
</script>

<style>
    .footer {
        position: relative;
    }
</style>
