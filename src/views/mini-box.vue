<template>
        <div v-if="microApp"
        @dblclick.prevent="toggleMini"
        class="mini-music-box js-mini-music-box flexbox-v" ref="dragMiniBox">
        <div class="wrap flexbox-h just-b">
            <div class="left flex-2 flexbox-h just-b"
            @mouseout.stop.prevent="showPlayer = false"
            @mouseover.stop.prevent="showPlayer = true"
            >
                <div class="img tl" @mouseover.stop>
                    <img :src="playData.picUrl" alt="">
                </div>
                <div class="name tc">
                    <div class="text" ref="textMoveDom" v-if="currLyric && currLyric!==null">{{playData.paused ? playData.name || '--' : currLyric.text|| '--' }}</div>
                    <span v-show="playData.paused" class="name tc">{{playData.singer || '--'}}</span>
                </div>
                <div class="more js-more text"
                :class="{'active': showPlayer}">
                    <div class="wrap flexbox-h tc just-c">
                        <p class="name line-one">{{playData.name || '--'}}</p>
                        <span class="line"> - </span>
                        <span class="singer line-one">{{playData.singer || '--'}}</span>
                    </div>
                </div>
            </div>
            <div @dblclick.stop class="play-btn js-play-btn flexbox-h just-a">
                <i class="icon-music-play-left"
                @click="playPrev"></i>
                <i class="icon-play js-play"
                :class="{
                    'icon-music-pause': playData.paused,
                    'icon-music-play': !playData.paused,
                    }"
                    @click="toggleAudioPlay"></i>
                <i class="icon-music-play-right"
                @click="playNext"></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            playData: {
                lyrc: '一诺千金到尽头',
                name: '菩提偈',
                singer: '刘惜君',
                picUrl: require('@/assets/images/avatar.jpg')
            },
            currLyric: {},
            showList: false,
            showVolume: false,
            showPlayer: true,
            audioVolumePos: {
                w: ''
            },
            showBox: false,
            microApp: false,
            showMiniBox: true
        }
    },
    watch: {
        // playData () {
        //     return this.$store.state.playData || {}
        // },
        currLyric: {
            handler (old, val) {
                if (old.text === val.text || this.playData.paused) return
                const textMoveDom = this.$refs.textMoveDom
                let w = this.currLyric.text.length * 12
                w = w < 100 ? 100 : w
                if (textMoveDom !== null) {
                    textMoveDom.style.left = 0
                    textMoveDom.style.width = w + 'px'
                    setTimeout(() => {
                        clearInterval(textMoveDom._move)
                        this.textMove(textMoveDom)
                    }, 1000)
                }
            },
            deep: true
        }
    },
    mounted () {
        // console.log(window, 'window')
        this.microApp = !!window.electronAPI
        window.electronAPI && window.electronAPI.onPlaySong((e, { playData, currLyric }) => {
            this.playData = { ...this.playData, ...JSON.parse(playData) }
            this.currLyric = JSON.parse(currLyric)
        })
        document.body.style.overflow = 'hidden'
        this.textMove(this.$refs.textMoveDom)
    },
    methods: {
        textMove (oCon) {
            if (oCon && oCon !== null) {
                oCon._move = null
                const step = -1
                if (oCon.textContent.length <= 10) {
                    clearInterval(oCon._move)
                    return
                } else {
                    // oCon.textContent += '' + oCon.textContent
                    this.autoRoll(oCon, step)
                }
                oCon._move = setInterval(() => {
                    this.autoRoll(oCon, step)
                }, 30)
            }
        },
        autoRoll (oCon, step) {
            if (oCon.offsetLeft < -oCon.offsetWidth + 100) {
                oCon.style.left = -oCon.offsetWidth + 100
                clearInterval(oCon._move)
            }
            if (oCon.offsetLeft > 0) {
                oCon.style.left = -oCon.offsetWidth / 2 + 'px'
            }
            oCon.style.left = oCon.offsetLeft + step + 'px'
        },
        toggleAudioPlay () {
            window.electron && window.electron.togglePlay({ value: true })
        },
        playNext () {
            window.electron && window.electron.nextPlay({ value: true })
        },
        playPrev () {
            window.electron && window.electron.prevPlay({ value: true })
        },
        toggleMini () {
            window.electron && window.electron.toggleMini({ value: false })
        },
        onSetVolumeClick () {},
        onThemeShow () {}
    }
}
</script>
<style lang="less" scoped>
.mini-music-box {
    min-height: 42px;
    width: 326px;
    position: static;
    display: inline-block;
    z-index: 100;
    margin: 0;
    letter-spacing: 0px;
    box-shadow: 0 0 5px @c-666;
    background-color: @white;
    user-select: initial;
    overflow: hidden;
    &:hover .left {
            >.name {
                display: none;
            }
            .more {
                top: 0;
                overflow: hidden;
            }
        }
    .wrap {
        z-index: 10;
        position: relative;
        background: #fff;
        height: 100%;
        // box-shadow: 0 0 5px @c-999;
    }
    .left {
        .img {
            width: 42px;
            height: 42px;
            // border: 1px solid @c-e8;
            overflow: hidden;
            margin-right: 10px;
        }
        .name {
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            line-height: 18px;
            position: relative;
            .text {
                user-select: none;
                position: relative;
                margin: 0 auto;
            }
            span {
                color: @c-999;
            }
        }
        .more {
            position: absolute;
            height: 100%;
            width: 180px;
            top: -42px;
            left: 42px;
            z-index: 10;
            height: 42px;
            border-top: 0;
            line-height: 24px;
            // display: none;
            overflow: hidden;
            color: @c-666;
            transition: all 0.3s;
            .name {
                height: 100%;
                width: auto;
                color: @c-333;
                line-height: 42px;
                max-width: 120px;
            }
        }
    }
    .right {
        padding: 0 18px;
        position: relative;
        .star-icon,
        .share-icon {
            &::after {
                font-size: 14px;
            }
        }
        span:hover {
            &::after {
                color: @c-666;
            }
        }
        span::after {
            color: @c-999;
        }
        .volume {
            position: absolute;
            // display: none;
            right: -2px;
            top: -45px;
            background-color: @white;
            // overflow: hidden;
            margin: 0;
            padding: 12px 7px;
            border-radius: 3px;
            box-shadow: 0 2px 5px @c-999;
            border: 1px solid @c-666;
            &::after {
                content: '';
                height: 10px;
                width: 10px;
                transform: rotateZ(-45deg);
                background-color: @white;
                border-bottom: 1px solid @c-666;
                border-left: 1px solid @c-666;
                position: absolute;
                left: 50%;
                top: 27px;
                // margin-left: -8px;
                // border-width: 8px 8px;
                // border-style: solid;
                // border-color: @white transparent transparent transparent;
            }
            .progress-bar {
                margin: 0;
                height: 8px;
                background-color: @c-999;
                // overflow: hidden;
                border-radius: 8px;
                .line {
                    height: 8px;
                    background-color: @c-666;
                    border-radius: 8px;
                }
                .point {
                    top: -3px;
                    &::after {
                        background-color: @c-666;
                    }
                }
            }
        }
    }
    .play-btn {
            padding: 0 20px;
            box-sizing: border-box;
            background-color: @white;
            // display: none;
            opacity: 1;
            transition: all 0.5s;
            &.active {
                opacity: 1;
            }
            i::after {
                background-color: @white;
                color: @primary;
            }
            .icon-play::after {
                padding: 4px;
                border: 1px solid @primary;
                cursor: pointer;
                border-radius: 30px;
            }
            i.play::after {
                cursor: pointer;
                content: '\e6a5';
            }
    }
}
</style>
