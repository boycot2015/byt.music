<template>
  <div class="lyric flexbox-v" ref="lyricBox" @dblclick.stop v-show="isShow">
      <div class="header">
          <div class="close" @click="onClose">×</div>
          <div class="operate-icon">
            <i class="font-min font-icon" @click.stop="setFontStyle('min')" title="减小字体">A-</i>
            <i class="font-plus font-icon" @click.stop="setFontStyle('plus')" title="加大字体">A+</i>
            <i class="text icon font-icon theme icon-music-clothes" @click.stop="setFontStyle('color')"></i>
            <i class="text icon font-icon theme icon-music-link"></i>
          </div>
      </div>
      <div class="content" :style="fontStyle">
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
                color: '#fff'
            },
            fontStyleList: [{
                id: 1,
                'font-size': '20px',
                'line-height': '32px',
                color: '#fff'
            }, {
                id: 2,
                'font-size': '24px',
                'line-height': '32px',
                color: '#fff'
            }, {
                id: 3,
                'font-size': '32px',
                'line-height': '40px',
                color: '#fff'
            }, {
                id: 4,
                'font-size': '40px',
                'line-height': '48px',
                color: '#fff'
            }, {
                id: 5,
                'font-size': '48px',
                'line-height': '54px',
                color: '#fff'
            }, {
                id: 6,
                'font-size': '54px',
                'line-height': '60px',
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
            isMinBoxMoved: false
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
                state.currLyric = JSON.parse(currLyric)
                // console.log(state.currLyric, JSON.parse(currLyric), 'currLyric')
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
                state.fontStyleList.map(el => {
                    el.color = state.fontStyle.color
                })
            }
            const fontStyle = state.fontStyleList.filter(el => el.id === state.fontStyle.id)[0]
            state.fontStyle = JSON.parse(JSON.stringify(fontStyle))
            storage.set('fontStyles', state.fontStyle)
            window.electron && window.electron.playSong({ currLyric: JSON.stringify(state.currLyric), playData: JSON.stringify(storage.get('playData')), lyricStyle: JSON.stringify(storage.get('fontStyles')) })
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
</style>
