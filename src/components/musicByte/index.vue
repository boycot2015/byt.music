
<template>
    <div class="equalizer-box">
        <!-- <div class="equalizer">
        </div> -->
        <canvas id="music-bar-canvas"></canvas>
    </div>
</template>
<style lang="less">
/* body {
  font-family: arial, sans-serif;
  background-color: #000;
  width: 100%;
  height: calc(100vh);
  margin: 0;
} */
#music-bar-canvas {
    width: 350px;
    height: 50px;
}
.equalizer-box {
    /* display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; */
}
.equalizer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-top: 0;
}

.equalizer-bar {
  width: 2px;
  margin: 0 2px;
  display: flex;
  flex-direction: column-reverse;
}
.equalizer-bar span {
  display: block;
  height: 2px;
  border-radius: 0x;
  width: 100%;
  margin: 0;
  background-color: #FFF;
  transition: all .2s ease;
  opacity: 1;
}
.equalizer-bar span {
  background: @primary;
}
</style>

<script>
import {
// ref,
    computed,
    watch,
    onMounted,
    reactive, toRefs
// getCurrentInstance
// toRefs
} from 'vue'
import { useStore } from 'vuex'
// import {
//     Player,
//     AudManager,
//     Drawer
// } from './draw'
import { getLocalColors } from '@/utils'
export default {
    name: 'musicByte',
    data () {
        return {
            MAX_BAR: 60,
            MAX_BAR_HEIGHT: 18,
            colors: [
                '#fc0127',
                '#fb0275',
                '#b50cd3',
                '#6407e9',
                '#2a06a9',
                '#080ad7',
                '#0265e2',
                '#03fcfc',
                '#02fe46',
                '#05fb0f',
                '#97f611',
                '#f5e506',
                '#d7a414',
                '#fc6b02',
                '#df1506'
            ],
            timer: null
        }
    },
    setup (props, { emit }) {
        const store = useStore()
        const playData = store.state.playData
        // const MAX_BAR = 60
        // const MAX_BAR_HEIGHT = 18
        const state = reactive({
            activeClass: false,
            requestTimer: null,
            timer: null,
            isStar: false,
            drawType: Math.ceil((Math.random() * 4)),
            ctx: '',
            analyser: '',
            capYPositionArray: [], // 将上一画面各帽头的位置保存到这个数组
            colors: [
                '#fc0127',
                '#fb0275',
                '#b50cd3',
                '#6407e9',
                '#2a06a9',
                '#080ad7',
                '#0265e2',
                '#03fcfc',
                '#02fe46',
                '#05fb0f',
                '#97f611',
                '#f5e506',
                '#d7a414',
                '#fc6b02',
                '#df1506'
            ],
            playData: {
                ...computed(() => store.state.playData)
            }
        })
        watch(() => store.state.playData.paused, (value) => {
            if (!store.state.playData.paused) {
                !state.ctx && drawGraphy()
                setTitle()
            } else {
                clearTimeout(state.timer)
            }
        })
        watch(() => store.state.themeChanged, (value) => {
            if (state.ctx) {
                state.capYPositionArray = []
                state.drawType = Math.ceil((Math.random() * 4))
                cancelAnimationFrame(state.requestTimer)
                renderDrawMaster()
                // console.log(state.drawType, 'state.drawType')
            }
        })
        onMounted(() => {
            state.colors = getLocalColors(100).colors.map(el => el.primary)
            // window.onblur = function () {
            //     setTitle()
            // }
        })
        const setTitle = () => {
            var t = 0
            function n () {
                var e = playData.name
                e = ' \u6B63\u5728\u64AD\u653E\uFF1A' + e + ' '
                document.title = e.substring(t, e.length) + e.substring(0, t)
                t++
                t > e.length && (t = 0)
                state.timer = setTimeout(n, 300)
            }
            var audio = document.getElementById('play-audio')
            !audio.paused && n()
        }
        const drawGraphy = () => {
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext
            var audio = document.getElementById('play-audio')
            var ctx = new AudioContext()
            state.ctx = ctx
            var analyser = ctx.createAnalyser()
            state.analyser = analyser
            var audioSrc = ctx.createMediaElementSource(audio)
            // we have to connect the MediaElementSource with the analyser
            audioSrc.connect(analyser)
            analyser.connect(ctx.destination)
            renderDrawMaster()
        }
        // loop
        const renderDrawMaster = () => {
            var canvas = document.getElementById('music-bar-canvas')
            var cwidth = canvas.width
            var cheight = canvas.height - 2
            var meterWidth = 4 // 频谱条宽度
            var gap = 2 // 频谱条间距
            var capHeight = 2
            const root = document.querySelector(':root')
            let barColor = root !== null && root.getAttribute('style')
            barColor = (barColor && barColor.split(':')[1])
            var capStyle = barColor || '#fff'
            var ctx = canvas.getContext('2d')
            const gradient = ctx.createLinearGradient(0, 0, 0, 300)
            const { analyser } = state
            analyser.fftSize = 2048 // 快速傅里叶变换频谱大小 32 - 2048之间的2的幂次方数
            var array = new Uint8Array(analyser.frequencyBinCount)
            analyser.getByteFrequencyData(array)
            var meterNum = Math.round(cwidth * 5 / (meterWidth + gap)) // 频谱条数量
            const styleConfig = setDrawStyles({ type: state.drawType, array, meterNum, meterWidth, gap, barColor })
            array = styleConfig.array
            meterNum = styleConfig.meterNum
            gradient.addColorStop(1, barColor || '#f00')
            gradient.addColorStop(0.5, barColor || '#f00')
            // var step = Math.floor(array.length / meterNum) // 计算采样步长
            var step = Math.floor(array.length / meterNum) // 计算采样步长
            ctx.clearRect(0, 0, cwidth, cheight)
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step] // 获取当前能量值
                if (state.capYPositionArray.length < Math.round(meterNum)) {
                    state.capYPositionArray.push(value)
                }
                ctx.fillStyle = capStyle
                // 开始绘制帽头
                if (value < state.capYPositionArray[i]) { // 如果当前值小于之前值, 则使用前一次保存的值来绘制帽头
                    ctx.fillRect(i * (meterWidth + gap), Math.abs(cheight - (--state.capYPositionArray[i])), meterWidth, capHeight)
                } else { // 否则使用当前值直接绘制
                    ctx.fillRect(i * (meterWidth + gap), Math.abs(cheight - value), meterWidth, capHeight)
                    state.capYPositionArray[i] = value
                };
                // 开始绘制频谱条
                gradient.addColorStop(0, styleConfig.colors[i] || '#f00')
                ctx.fillStyle = gradient // set the filllStyle to gradient for a better look
                ctx.fillRect(i * (meterWidth + gap) /* meterWidth+gap */, Math.abs(cheight - value + capHeight), meterWidth, cheight) // the meter
            }
            state.requestTimer = requestAnimationFrame(renderDrawMaster)
        }
        const setDrawStyles = ({ type, array, meterNum, meterWidth, gap, barColor }) => {
            let colors = state.colors
            var canvas = document.getElementById('music-bar-canvas')
            var cwidth = canvas.width
            switch (type) {
            case 1:
                array && (array = sortArray(array) || array)
                meterNum = Math.round(cwidth / (meterWidth + gap)) // count of the meters
                break
            case 2:
                colors = state.colors.map(el => { return barColor })
                break
            case 3:
                array && (array = sortArray(array) || array)
                meterNum = Math.round(cwidth / (meterWidth + gap)) // count of the meters
                colors = state.colors.map(el => barColor)
                break
            case 4:
                meterNum = Math.round(cwidth * 5 / (meterWidth + gap)) // count of the meters
                colors = state.colors
                break
            }
            return { array, meterNum, meterWidth, gap, barColor, colors }
        }
        const sortArray = (array) => {
            var arr = array // 用于存放用户输入的值，这里将用户输入的数据按照“，”进行分割成数组
            arr = arr.sort((a, b) => a - b)// 由小到大排序
            var result = []// 最终输出结果
            result.push(arr[0])// 排序之后直接将第1、2位的数据放入最终结果之中
            result.push(arr[1])
            var l = 1// 定义该从何处插入数组值
            // var lNum = parseInt(arr[0]);
            // var rNum = parseInt(arr[1])// 最终结果的左右侧的数值之和
            var boor = false// 这个定义是用于对循环进行限制，从第三个数据开始，每两个进行比对，第一个比对后，第二个就不用再进行循环了！
            for (var i = 2; i < arr.length; i++) { // 两翼数据平衡第一次
                if ((arr.length) % 2 === 0) { // 判断输入的数组长度是否为偶数
                    if (boor) {
                        boor = false
                        continue
                    } else {
                        boor = true
                        result.splice(l, 0, arr[i + 1])
                        l++
                        result.splice(l, 0, arr[i])
                    }
                } else {
                    if (i === arr.length - 1) {
                        result.splice(l, 0, arr[i])
                    } else if (boor) {
                        boor = false
                        continue
                    } else {
                        boor = true
                        result.splice(l, 0, arr[i + 1])
                        l++
                        result.splice(l, 0, arr[i])
                    }
                }
            }
            // 两翼数据平衡处理第二次
            var lIndex = 0// 初始result左部索引号
            var rIndex = result.length - 1// 初始result右部索引号
            var lSum = 0; var rSum = 0// 存放左右两端数据的和
            for (let i = 0; i < Math.floor(result.length / 2); i++) { // 需要求和的次数为数组长度的一半，这里需要注意当数组长度为偶数时，默认左边少进行一次求和，保证最大数在中间部分
                if ((result.length) % 2 === 0) {
                    rSum += parseInt(result[rIndex])
                    rIndex--
                    if (i < (result.length / 2) - 1) {
                        lSum += parseInt(result[lIndex])
                        lIndex++
                    }
                } else {
                    lSum += parseInt(result[lIndex])
                    lIndex++
                    rSum += parseInt(result[rIndex])
                    rIndex--
                }
            }
            if (lSum < rSum - 3) { // 两翼数据平衡处理第三次，根据第二次结果来判断执行，减去3的目的是限制两边之差，若小于3则不用进行比对，直接输出便可
                var gap = Math.abs(lSum - rSum) - 3// 数值差的绝对值
                for (let i = gap; i > 0; i--) {
                    for (var j = Math.floor((result.length / 2)); j < result.length; j++) {
                        if (i === parseInt(result[j])) {
                            var a = result.slice(j, j + 1)
                            result.splice(j, 1)
                            if (j === result.length) {
                                result.splice(1, 0, a[0])
                            } else {
                                result.splice(result.length - j, 0, a[0])
                            }
                            return result || array// 满足条件，不用再进行数据交换了，结束整个循环；
                        }
                    }
                }
            } else {
                return result || array
            }
        }
        return {
            ...toRefs(state),
            drawGraphy,
            sortArray
        }
    }
}
</script>
