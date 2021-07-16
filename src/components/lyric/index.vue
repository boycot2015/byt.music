<template>
  <div class="lyric flexbox-v" ref="lyricBox" v-show="isShow">
      <div class="header">
          <div class="close" @click="onClose">×</div>
          <div class="operate-icon">
            <i class="font-min font-icon" @click.stop="setFontStyle('min')" title="减小字体">A-</i>
            <i class="font-plus font-icon" @click.stop="setFontStyle('plus')" title="加大字体">A+</i>
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
    // computed,
    watch,
    reactive,
    onMounted,
    onUpdated,
    toRefs
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
    drag
} from '@/utils'
// const storage = store
export default {
    props: {
        isShow: {
            type: [Object, Boolean],
            default: true
        }
    },
    emits: [
        'update:isShow'
    ],
    setup (props, { emit }) {
        const store = useStore()
        const lyricBox = ref(null)
        const currLyric = store.state.detail.songDetail.currLyric || {}
        const detailStore = store.state.detail.songDetail
        const state = reactive({
            isShow: true,
            lyricList: [],
            fontStyle: {
                id: 4,
                'font-size': '32px',
                'line-height': '40px',
                color: '#fff'
            },
            fontStyleList: [{
                id: 1,
                'font-size': '16px',
                'line-height': '32px',
                color: '#fff'
            }, {
                id: 2,
                'font-size': '20px',
                'line-height': '32px',
                color: '#fff'
            }, {
                id: 3,
                'font-size': '24px',
                'line-height': '32px',
                color: '#fff'
            }, {
                id: 4,
                'font-size': '32px',
                'line-height': '32px',
                color: '#fff'
            }, {
                id: 5,
                'font-size': '40px',
                color: '#fff'
            }, {
                id: 6,
                'font-size': '60px',
                color: '#fff'
            }],
            currLyric,
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
            state.currLyric = value
            // state.lyricList.map((el, index) => {
            //     if (value.time === el.time) {
            //         if (index > 5 && index < state.lyricList.length - 5) {
            //             const offsetHeight = lyricScrollDom.value.children[0].children[0].offsetHeight
            //             animate(lyricScrollDom.value, offsetHeight * (index - 5), 'scrollTop', 1)
            //         } else {
            //             clearInterval(lyricScrollDom.value.timer)
            //         }
            //     }
            // })
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
            // state.currLyric = localStore.get('currLyric')
            console.log(state.currLyric, 'state.currLyric')
        })
        onUpdated(() => {
            // 处理
            if (state.isMinBoxMoved) {
                lyricBox.value.style.left = state.boxPos.min.left + 'px'
                lyricBox.value.style.top = state.boxPos.min.top + 'px'
            }
        })
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
            const fontStyle = state.fontStyleList.filter(el => el.id === state.fontStyle.id)[0]
            state.fontStyle = JSON.parse(JSON.stringify(fontStyle))
            // console.log(fontStyle, 'state.fontStyle')
        }
        const onClose = () => {
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
            .font-icon {
                margin-right: 10px;
                cursor: pointer;
            }
        }
    }
</style>
