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
                    <div class="text" ref="textMoveDom" v-if="currLyric && currLyric!==null">{{playData.paused ? playData.name : currLyric.text }}</div>
                    <span v-show="playData.paused" class="name tc">{{playData.singer}}</span>
                </div>
                <div @dblclick.stop class="play-btn js-play-btn flexbox-h just-a"
                :class="{'active': showPlayer}">
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
                <div class="more js-more text"
                :class="{'active': showPlayer}">
                    <div class="wrap flexbox-h tc just-c">
                        <p class="name line-one">{{playData.name || '--'}}</p>
                        <span class="line"> - </span>
                        <span class="singer line-one">{{playData.singer || '--'}}</span>
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
            showPlayer: false,
            audioVolumePos: {
                w: ''
            },
            showBox: false,
            microApp: false,
            showMiniBox: true
        }
    },
    computed: {
        // playData () {
        //     return this.$store.state.playData || {}
        // },
        // currLyric () {
        //     return this.$store.state.detail.songDetail.currLyric || {}
        // }
    },
    mounted () {
        // console.log(window, 'window')
        this.microApp = !!window.electronAPI
        window.electronAPI && window.electronAPI.onPlaySong((e, { playData, currLyric }) => {
            // console.log(JSON.parse(playData), 'JSON.parse(playData)')
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
                if (oCon.textContent.length <= 8) {
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
    top: 60px;
    position: static;
    display: inline-block;
    z-index: 100;
    letter-spacing: 0px;
    box-shadow: 0 0 10px @c-666;
    background-color: @white;
    user-select: initial;
    .wrap {
        z-index: 10;
        position: relative;
        background: #fff;
        box-shadow: 0 0 5px @c-999;
    }
    .left {
        &:hover {
            >.name {
                display: none;
            }
            .play-btn {
                display: flex;
                opacity: 1;
            }
            .more {
                height: 24px;
                overflow: hidden;
            }
        }
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
                position: relative;
                margin: 0 auto;
            }
            span {
                color: @c-999;
            }
        }
        .play-btn {
            position: absolute;
            left: 50px;
            top: 2px;
            height: 38px;
            width: 155px;
            z-index: 10;
            padding: 0 20px;
            box-sizing: border-box;
            background-color: @white;
            // display: none;
            opacity: 0;
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
        // &:hover {
        //     .play-btn {
        //         opacity: 1;
        //         display: flex;
        //     }
        // }
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
    .more {
        position: absolute;
        width: 323px;
        top: 42px;
        left: 1px;
        z-index: -1;
        background-color: rgba(255, 255, 255, 0.9);
        box-shadow: 0 0px 3px @c-999;
        border: 1px solid @c-ccc;
        border-top: 0;
        line-height: 24px;
        // display: none;
        overflow: hidden;
        overflow-y: auto;
        color: @c-666;
        max-height: 280px;
        height: 0;
        transition: all 0.3s;
        &.active {
            height: 24px;
            overflow: hidden;
        }
        &.actived {
            height: 280px;
        }
        .name {
            width: auto;
            color: @c-333;
            max-width: 120px;
        }
        .singer {
            max-width: 60px;
        }
        .line {
            margin: 0 4px;
        }
        // span,
        // .sing {
        //     color: @c-666;
        // }
    }
}
</style>
