<template>
  <div class="lyric flexbox-v" ref="lyricBox" @dblclick.stop v-show="isShow">
      <div class="header">
          <div class="close" @click="onClose">×</div>
          <div class="operate-icon">
            <i class="font-min font-icon" @click.stop="setFontStyle('min')" title="减小字体">A-</i>
            <i class="font-plus font-icon" @click.stop="setFontStyle('plus')" title="加大字体">A+</i>
            <i class="font-font font-icon" @click.stop="setFontStyle('font')" title="字体">A</i>
            <i class="text icon font-icon theme icon-music-clothes" @click.stop="setFontStyle('color')"></i>
            <i class="text icon font-icon theme icon-music-link"></i>
          </div>
      </div>
      <div class="content" :class="{'paused': playData.paused, 'load': !isChange }" :style="{...fontStyle}">
            {{currLyric.text || '纯音乐，请欣赏'}}
      </div>
  </div>
</template>
<script>
import {
    ref,
    watch,
    reactive,
    onMounted,
    onUpdated,
    toRefs
    // computed
    // onBeforeMount
    // getCurrentInstance
} from 'vue'
import {
    useStore
} from 'vuex'
// import {
//     useRouter
// } from 'vue-router'
import {
    drag,
    store,
    getLocalColors
} from '@/utils'
const storage = store
export default {
    props: {
        isShow: {
            type: [Object, Boolean],
            default: false
        }
    },
    emits: [
        'update:isShow'
    ],
    setup (props, { emit }) {
        const store = useStore()
        const lyricBox = ref(null)
        const detailStore = store.state.detail.songDetail
        const state = reactive({
            isShow: false,
            lyricList: [],
            fontStyle: {
                id: 3,
                'font-size': '32px',
                'line-height': '40px',
                fontFamily: '宋体',
                color: '#fff'
            },
            fontStyleList: [{
                id: 1,
                'font-size': '20px',
                'line-height': '32px',
                fontFamily: '宋体',
                color: '#fff'
            }, {
                id: 2,
                'font-size': '24px',
                'line-height': '32px',
                fontFamily: '宋体',
                color: '#fff'
            }, {
                id: 3,
                'font-size': '32px',
                'line-height': '40px',
                fontFamily: '宋体',
                color: '#fff'
            }, {
                id: 4,
                'font-size': '40px',
                'line-height': '48px',
                fontFamily: '宋体',
                color: '#fff'
            }, {
                id: 5,
                'font-size': '48px',
                'line-height': '54px',
                fontFamily: '宋体',
                color: '#fff'
            }, {
                id: 6,
                'font-size': '54px',
                'line-height': '60px',
                fontFamily: '宋体',
                color: '#fff'
            }],
            currLyric: detailStore.currLyric || {},
            // currLyric: computed(() => detailStore.currLyric || {}),
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
            playData: storage.get('playData') || {},
            isMinBoxMoved: false,
            isChange: false
        })
        watch(() => [
            detailStore.lyricList
        ], (value) => {
            state.lyricList = value[0]
        })
        watch(() => detailStore.currLyric, (value) => {
            !window.electronAPI && (state.currLyric = value)
        })
        onMounted(() => {
            window.addEventListener('resize', (e) => {
                drag({
                    obj: [lyricBox.value]
                })
            })
            drag({
                obj: [lyricBox.value],
                fn (pos) {
                    // console.log(pos, 'pos')
                    state.isMinBoxMoved = true
                    state.boxPos.min = pos
                },
                end (pos) {
                }
            })
            // state.currLyric = storage.get('currLyric')
            // console.log(storage.get('fontStyles'), 'state.fontStyle')
            if (storage.get('fontStyles') && storage.get('fontStyles') !== null) {
                state.fontStyle = storage.get('fontStyles')
                state.fontStyleList.map(el => {
                    el.color = state.fontStyle.color
                })
            }
            state.isShow = props.isShow
            window.electronAPI && window.electronAPI.onPlaySong((e, { playData, currLyric }) => {
                state.isChange = false
                if (state.currLyric.text !== JSON.parse(currLyric).text) {
                    const arr1 = state.currLyric.time.split(':')
                    const time1 = Number(arr1[0]) * 60 + Number(arr1[1])
                    const arr2 = JSON.parse(currLyric).time.split(':')
                    const time2 = Number(arr2[0]) * 60 + Number(arr2[1])
                    let time = Number(time2) - Number(time1)
                    time = time > 0 && time < 20 ? time : time >= 20 ? 3 : 1
                    // console.log(time, JSON.parse(currLyric).time, state.currLyric.time, 'time')
                    lyricBox.value && lyricBox.value.style.setProperty('--lyirc-time', time + 's')
                    state.isChange = true
                }
                state.currLyric = JSON.parse(currLyric)
                state.playData = JSON.parse(playData) || {}
            })
        })
        onUpdated(() => {
            // 处理
            if (state.isMinBoxMoved) {
                lyricBox.value.style.left = state.boxPos.min.left + 'px'
                lyricBox.value.style.top = state.boxPos.min.top + 'px'
            }
        })
        // 设置歌词样式
        const setFontStyle = (type) => {
            if (type === 'plus') {
                state.fontStyle.id += 1
                if (state.fontStyle.id >= state.fontStyleList.length) {
                    state.fontStyle.id = state.fontStyleList.length
                }
            }
            if (type === 'min') {
                state.fontStyle.id -= 1
                if (state.fontStyle.id <= 1) {
                    state.fontStyle.id = 1
                }
            }
            if (type === 'color') {
                const colorObj = getLocalColors()
                state.fontStyle.color = colorObj.themeColor.primary
                state.fontStyleList.map((el, index) => {
                    el.color = state.fontStyle.color
                })
            }
            if (type === 'font') {
                const family = ['宋体', '楷体', '黑体']
                state.fontStyle.fontFamily = family[Math.floor(Math.random() * family.length)]
                state.fontStyleList.map((el, index) => {
                    el.fontFamily = state.fontStyle.fontFamily
                })
            }
            const fontStyle = state.fontStyleList.filter(el => el.id === state.fontStyle.id)[0]
            state.fontStyle = JSON.parse(JSON.stringify(fontStyle))
            storage.set('fontStyles', state.fontStyle)
            lyricBox.value && lyricBox.value.style.setProperty('--lyirc-color', state.fontStyle.color)
            window.electron && window.electron.playSong({ currLyric: JSON.stringify(state.currLyric), playData: JSON.stringify(state.playData || {}), lyricStyle: JSON.stringify(state.fontStyle) })
        }
        const onClose = () => {
            if (window.electron) return window.electron.toggleLyric(false)
            emit('update:isShow', false)
        }
        // 监听弹层v-model
        watch(() => props.isShow, (val) => {
            state.isShow = val
        })
        return {
            lyricBox,
            setFontStyle,
            onClose,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="less" scoped>
    .lyric {
        position: fixed;
        font-size: 32px;
        z-index: 1000;
        min-width: 680px;
        align-self: flex-start;
        text-align: center;
        min-height: 80px;
        line-height: 40px;
        color: @white;
        top: 80px;
        border-radius: @border-radius;
        background: transparent;
        overflow: hidden;
        transition: opacity 0.5s;
        --lyirc-time: 4s;
        &:hover {
            background: rgba(0, 0, 0, 0.5);
            .header {
                opacity: 1;
            }
        }
        .header {
            height: 30px;
            line-height: 30px;
            opacity: 0;
            padding: 0;
            width: 100%;
            margin-bottom: 20px;
            overflow: hidden;
        }
        .content {
            padding: 0 20px 20px;
            background: #fff -webkit-linear-gradient(left, var(--lyirc-color), var(--lyirc-color)) no-repeat 0 0;
            font-weight: bold;
            font-family: '宋体';
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-size: 0 100%;
            // letter-spacing: 2px;
            // text-shadow: 2px 2px 20px var(--c-000);
            &.load {
                background-size:100% 100%;
                // cubic-bezier(0, 0.38, 0.28, 0.1)
                animation: scan var(--lyirc-time) ease-out;
            }
            &.paused {
                animation-play-state: paused;
                -webkit-animation-play-state: paused;
            }
        }
        .close {
            position: absolute;
            right: 10px;
            cursor: pointer;
            &:hover {
                color: @primary;
            }
        }
        .operate-icon {
            text-align: center;
            font-size: 16px;
            width: 150px;
            margin: 0 auto;
            -webkit-app-region: no-drag;
            .font-icon {
                margin-right: 10px;
                cursor: pointer;
                &::after {
                    color: @white;
                }
            }
        }
    }
    @keyframes scan {
        0% {
            background-size:0 100%;
        }
        100% {
            background-size:100% 100%;
        }
    }
</style>
