<template>
    <!-- 音乐动画 -->
    <div class="lyric-animate" v-loading="loading" :class="{'is-play': isPlay }">
        <template v-if="!loading">
            <css-doodle v-for="item in list" v-show="item.id === current.id" :key="item.id" :click-to-update="!!current['click-to-update']">
                {{ item.code }}
            </css-doodle>
            <i class="close icon-music-close" @click.stop="onClose"></i>
            <div class="lyric" ref="lyricBox" :class="{'paused': !!playData.paused, 'load': !isChange && !current.style.width, 'loadV': !isChange && current.style.width }" :style="{...current.style, ...currentlyric.style}">{{ currentlyric.text }}</div>
            <div class="bars flexbox-v aling-c just-c" :class="{'is-expand': isExpand}">
                <i class="expand icon-music-left" :style="{color: current.color}" :class="{'icon-music-right': !isExpand}" @click="isExpand = !isExpand"></i>
                <div class="list">
                    <div class="list-item" @click="onItemClick(item)" :class="{'is-active': item.id === current.id}" v-for="item in list" :key="item.id">
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<style scoped lang="less">
css-doodle {
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.lyric-animate {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    height: 100%;
    background-color: #fff;
    transform: translateY(-800px) scale(0.5);
    opacity: 0;
    transition: all ease-in-out .4s;
    &.is-play {
        opacity: 1;
        transform: translateY(0px);
        transform: scale(1);
    }
    .lyric {
        --lyirc-color: var(--primary-color);
        position: absolute;
        top: 50%;
        left: 50%;
        color: #333;
        max-width: 600px;
        font-size: 30px;
        display: flex;
        text-align: center;
        flex-direction: column;
        align-items: center;
        flex-wrap: wrap;
        --lyirc-time: 4s;
        line-height: 38px;
        background: #fff -webkit-linear-gradient(left, var(--lyirc-color), var(--lyirc-color)) no-repeat 0 0;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        background-size: 0 100%;
        // text-shadow: 3px 0px 5px var(--c-999);
        &.load {
            background-size:100% 100%;
            // cubic-bezier(0, 0.38, 0.28, 0.1)
            animation: scan var(--lyirc-time) ease-out;
        }
        &.loadV {
            background-size:100% 100%;
            // cubic-bezier(0, 0.38, 0.28, 0.1)
            animation: scanV var(--lyirc-time) ease-out;
        }
        &.paused {
            -webkit-animation-play-state: paused;
            animation-play-state: paused;
        }
        @keyframes scan {
            0% {
                background-size:0 100%;
            }
            100% {
                background-size:100% 100%;
            }
        }
        @keyframes scanV {
            0% {
                background-size:100% 0;
            }
            100% {
                background-size:100% 100%;
            }
        }
    }
    .close {
        right: 12px;
        top: 10px;
        cursor: pointer;
        position: absolute;
        display: block;
        text-align: center;
        margin-bottom: 10px;
        z-index: 999;
        transition: all .3s;
        &:hover {
            transform: rotateZ(90deg);
        }
        &::after {
            color: #ccc;
            font-size: 20px;
        }
    }
    .bars {
        position: absolute;
        top: 0;
        right: 0;
        width: 48px;
        height: 100%;
        padding-top: 20px;
        box-sizing: border-box;
        transform: translateX(48px);
        transition: all ease-in-out .4s;
        background-color: rgba(0, 0, 0, 0.6);
        &.is-expand {
            transform: translateX(0);
        }
    }
    .expand {
        position: absolute;
        right: 48px;
        top: 50%;
        cursor: pointer;
        color: #ccc;
        &::after {
            font-size: 30px;
        }
    }
    .list {
        line-height: 22px;
        align-items: center;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100% - 40px);
        &-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ccc;
            padding: 10px;
            cursor: pointer;
            text-align: center;
        &.is-active {
            color: #333;
            background-color: rgba(255, 255, 255, 0.6);
        }
       }
    }
}
</style>
<script>
import {
    store
} from '@/utils'
const storage = store
export default {
    props: {
    },
    components: {
    },
    data () {
        return {
            current: {},
            hide: false,
            isPlay: false,
            loading: true,
            isExpand: true,
            isChange: false,
            list: [
                {
                    id: 1,
                    name: '炫彩万花筒',
                    style: { color: '#fff', 'font-family': '楷体', fontSize: '28px' },
                    code: `<style>
                        --color: #51eaea, #fffde1, #ff9d76, #FB3569;

                        @grid: 30x1 / 100vw 100vh / #270f34; 
                        
                        :container {
                            perspective: 30vmin;
                            --deg: @p(-180deg, 180deg);
                        }
                        
                        :after, :before {
                            content: '';
                            background: @p(--color); 
                            @place: @r(100%) @r(100%);
                            @size: @r(6px);
                            @shape: heart;
                        }

                        @place: center;
                        @size: 18vmin; 

                        box-shadow: @m2(0 0 50px @p(--color));
                        background: @m100(
                            radial-gradient(@p(--color) 50%, transparent 0) 
                            @r(-20%, 120%) @r(-20%, 100%) / 1px 1px
                            no-repeat
                        );

                        will-change: transform, opacity;
                        animation: scale-up 48s linear infinite;
                        animation-delay: calc(-48s / @I * @i);

                        @keyframes scale-up {
                            0%, 95.01%, 100% {
                            transform: translateZ(0) rotate(0);
                            opacity: 0;
                            }
                            10% { 
                            opacity: 1; 
                            }
                            95% {
                            transform: 
                                translateZ(35vmin) rotateZ(var(--deg));
                            }
                        }
                    </style>`
                },
                {
                    id: 6,
                    name: '繁星璀璨',
                    style: { color: '#fff', fontSize: '28px', left: '50%', 'margin-left': '-250px', top: '85%' },
                    code: `:doodle {
                            @grid: 50x1 / 60vmin 60vmin;
                            @min-size: 600px 600px;
                            overflow: hidden;
                            background:
                            @m600(linear-gradient(0deg, @m2(rgba(255, 255, 255, @r(0.5, 1)))) @rep2(@r(0, 100)% )/ @rep2(@r(1, 2.5)px )no-repeat),
                            linear-gradient(180deg, #047dd4, #047dd4) 0 0 / 100% 100%;
                        }

                        --w: @r(2, 6);
                        --h: @r(3, 30);
                        position: absolute;
                        bottom: 20%;
                        left: calc((@index - 10) * 3%);
                        width: calc(var(--w) * 1%);
                        height: calc(var(--h) * 1%);
                        background: 
                            @m7(linear-gradient(0deg, @m2(hsla(calc(220 - @i() * 10), 70%, 68%, @r(0.7, 1)))) @rep2(@r(0, 100)% )/ @r(2, 6)px @r(1, 3)px no-repeat),
                            @p(
                            @m4(linear-gradient(0deg, #012b71, #012b71)),
                            linear-gradient(0deg, hsla(calc(220 - @i() * 10), 70%, 68%, 0), hsla(calc(220 - @i() * 10), 70%, 68%, 1))
                            );
                        opacity: calc(1 - 1 / 700 * @var(--w) * @var(--h));
                        -webkit-box-reflect: below 0.4vmin linear-gradient(transparent, rgba(0, 0, 0, 0.4));

                        @random(.3) {
                            ::after {
                            content: "";
                            position: absolute;
                            left: @r(45, 50)%;
                            bottom: 100%;
                            width: @r(2, 3)px;
                            height: @r(8, 20)px;
                            background: #0a3782;
                            }
                        }

                        @random(.4) {
                            ::after {
                            content: "";
                            position: absolute;
                            left: @r(45, 50)%;
                            bottom: 100%;
                            width: 40%;
                            height: 150%;
                            background: linear-gradient(0deg, rgba(255, 255, 255, .6), transparent);
                            transform-origin: 50% 105%;
                            clip-path: polygon(25% 0%, 75% 0%, 50% 100%, 40% 100%);
                            transform: rotate(@r(-40, 40)deg);
                            }
                        }

                        @random(.2) {
                            clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%, 0% 10%);
                        }

                        @random(.2) {
                            clip-path: polygon(80% 0, 100% 10%, 100% 100%, 0 100%, 0 0);
                        }

                        @random(.2) {
                            clip-path: polygon(50% 0, 100% 20%, 100% 100%, 0 100%, 0 20%);
                        }

                        @nth(1, 2, 3) {
                            position: relative;
                            z-index: 2;
                            bottom: initial;
                            left: initial;
                            @size: initial;
                            clip-path: initial;
                            background: transparent;
                            overflow: visible;
                            opacity: 1;

                            ::after {
                            content: "@pn(🕺,💃,🐈)";
                            position: absolute;
                            bottom: 20%;
                            left: @pn(3290, 2850, @r(50, 400))%;
                            font-size: @pn(6.784, 6.4, 3.2)vmin;
                            color: transparent;
                            text-shadow: 2px 2px 0 #0b0d2d, 2px 2px 1px rgba(255, 255, 255, 0.6);
                            transform: initial;
                            clip-path: initial;
                            @size: initial;
                            background: initial;
                            overflow: visible;
                            }
                        }

                        @nth(4) {
                            z-index: 1000;
                            opacity: .6;
                            bottom: initial;
                            clip-path: initial;
                            background: transparent;
                            position: absolute;
                            top: 0;
                            left: 0;
                            @size: 100%;
                            filter: @svg-filter(
                            <svg>
                                <filter>  
                                <feTurbulence baseFrequency=".6" numOctaves="0.1" />
                                </filter>
                            </svg>
                            )
                        }

                        @nth(5) {
                            position: absolute;
                            bottom: initial;
                            clip-path: initial;
                            opacity: 1;
                            z-index: 1;
                            top: 0;
                            left: 0;
                            @size: 100%;
                            opacity: 1;
                            --color: rgba(11, 13, 45, 1);
                            background: 
                            linear-gradient(90deg, transparent @r(25%, 35%), var(--color) @lr(), var(--color) calc(@lr() + 1%), transparent calc(@lr() + 1%), transparent @r(85%, 95%), var(--color) @lr(), var(--color) calc(@lr() + 1%), transparent calc(@lr() + 1%)) 0 0 / 100% 100%;
                        }

                        @nth(7) {
                            position: absolute;
                            bottom: initial;
                            clip-path: initial;
                            opacity: 1;
                            top: 0;
                            left: 0;
                            @size: 100%;
                            opacity: 1;
                            --color: rgba(11, 13, 45, 1);
                            background: linear-gradient(0deg, var(--color) 20%, transparent 20%, transparent @r(70%, 75%), var(--color) @lr(), var(--color) calc(@lr() + 1%), transparent calc(@lr() + 1%)) 0 0 / 100% 100%;
                        }

                        @nth(4, 5, 6, 7) {
                            ::after {
                            display: none;
                            }
                        }
                        @nth(6) {
                            position: absolute;
                            top: 10%;
                            left: 10%;
                            z-index: 2;
                            width: 4vmin;
                            height: 4vmin;
                            clip-path: initial;
                            background: transparent;
                            box-shadow: inset 1.5vmin 0 #efefc5;
                            border-radius: 50%;
                            opacity: 0.8;
                            transform: rotate(18deg);
                            filter: drop-shadow(0 0 10px #efefc5);
                            -webkit-box-reflect: initial;
                        }`
                },
                {
                    id: 2,
                    name: '光球流动',
                    style: { color: '#fff', 'font-family': '宋体', fontSize: '24px', top: '10%', width: '32px' },
                    code: `:doodle {
                    @grid: 10 / 10vmin;
                    background: #0a0c27;
                    filter: blur(.1px);
                    transform: scale(1)
                }

                @random {
                    border: 2px solid hsla(158, 70%, 68%, @rand(0.3));
                }

                @random {
                    filter: blur(1.5px);
                }

                @random {
                    animation: move 5s linear alternate infinite;
                }

                @random(0.1) {
                    animation: flicker 5s ease infinite;
                }

                @keyframes move {
                    0% {
                    transform:  translate(
                    @rand(-50%, 50%), @rand(-50%, 50%)
                    );
                    }

                    100% {
                    transform:  translate(
                    @rand(-50%, 50%), @rand(-50%, 50%)
                    );
                    }
                }

                @keyframes flicker {
                    0% {
                    opacity: 1;
                    }

                    50% {
                    opacity: 0;
                    }

                    100% {
                    opacity: 1;
                    }
                }

                border-radius: 100%;
                background: hsla(158, 70%, 68%, @rand(1));
                transform: scale(@rand(.5, 1.2))
                translate(
                @rand(-50%, 50%), @rand(-50%, 50%)
                );`
                }
                // {
                //     id: 4,
                //     name: '星光点点',
                //     style: { color: '#333', fontSize: '28px' },
                //     code: `<style>
                //     @grid: 50x1 / 50vmin;
                //     :container {
                //     perspective: 23vmin;
                //     }
                //     background: @m(
                //     @r(200, 240),
                //     radial-gradient(
                //         @p(#00b8a9, #f8f3d4, #f6416c, #ffde7d) 15%,
                //         transparent 50%
                //     ) @r(100%) @r(100%) / @r(1%, 3%) @lr no-repeat
                //     );

                //     @size: 80%;
                //     @place-cell: center;

                //     border-radius: 50%;
                //     transform-style: preserve-3d;
                //     animation: scale-up 20s linear infinite;
                //     animation-delay: calc(@i * -.4s);

                //     @keyframes scale-up {
                //     0% {
                //         opacity: 0;
                //         transform: translate3d(0, 0, 0) rotate(0);
                //     }
                //     10% {
                //         opacity: 1;
                //     }
                //     95% {
                //         transform:
                //         translate3d(0, 0, @r(100vmin, 55vmin))
                //         rotate(@r(-360deg, 360deg));
                //     }
                //     100% {
                //         opacity: 0;
                //         transform: translate3d(0, 0, 1vmin);
                //     }
                //     }
                //     </style>`
                // },
                // {
                //     id: 5,
                //     name: '水波纹路',
                //     style: { color: '#333', fontSize: '28px' },
                //     'click-to-update': true,
                //     code: `:doodle {
                //         --rspeed: @r(28s, 35s);
                //         --delay: @r(-200ms, -10ms);
                //         --cycle: @r(.5s, 2.5s);
                //         --angle: @r(2deg, 4deg);
                //         --da: @r(1vmin, 8vmin);
                //         --db: @r(1vmin, 8vmin);
                //         --bg: hsl(@r(360), 80%, 80%);

                //         @grid: 1x300 / 50vmin;
                //         animation: r var(--rspeed) linear infinite;
                //     }

                //     @size: 1px 50%;
                //     @place-cell: center;

                //     transform: rotate(calc(
                //         @calc(@i() - 1) * var(--angle)
                //     ));

                //     :after {
                //         content: '';
                //         @size: 100%;
                //         background: var(--bg);
                //         will-change: transform;
                //         animation:
                //         w var(--cycle) linear
                //         calc(@i() * var(--delay)) infinite;
                //     }

                //     --f: calc(@sin(@i() / 4) * @PI());
                //     @keyframes w {
                //         0 { transform: translateY(calc(var(--da) * var(--f))) }
                //         50% { transform: translateY(calc(var(--db) * var(--f))) }
                //     }
                //     @keyframes r {
                //         to { transform: rotate(@p(-1turn, 1turn)) }
                //     }`
                // }
            ]
        }
    },
    watch: {
        currentlyric (oldVal, newVal) {
            const arr1 = newVal.time.split(':')
            const time1 = Number(arr1[0]) * 60 + Number(arr1[1])
            const arr2 = oldVal.time.split(':')
            const time2 = Number(arr2[0]) * 60 + Number(arr2[1])
            let time = Number(time2) - Number(time1)
            console.log(time, 'time')
            time = time > 0 && time < 20 ? time : time >= 20 ? 3 : 1
            this.$refs.lyricBox && this.$refs.lyricBox.style.setProperty('--lyirc-time', time + 's')
            this.isChange = true
            setTimeout(() => {
                this.isChange = false
            }, 10)
        }
    },
    computed: {
        currentlyric () {
            const rootStore = this.$store.state
            const detailStore = rootStore.detail.songDetail
            if (!this.current.style) return { ...detailStore.currLyric || {}, style: {} }
            const style = {
                left: (this.current.style && this.current.style.left) || (this.current.style.width ? Math.random() * 90 : Math.random() * 40) + '%',
                top: (this.current.style && this.current.style.top) || (this.current.style.width ? Math.random() * 30 : Math.random() * 90) + '%'
            }
            return { ...detailStore.currLyric || {}, style } // 当前播放的歌词
        },
        playData () {
            return storage.get('playData') || {}
        }

    },
    mounted () {
        const myDoodle = document.querySelector('.doodle')
        this.current['click-to-update'] && myDoodle && myDoodle.addEventListener('click', () => {
            myDoodle.update()
        })
    },
    methods: {
        togglePlay () {
            this.loading = true
            this.current = this.list[Math.floor(Math.random() * this.list.length)] || this.list[0]
            this.isPlay = !this.isPlay
            this.loading = false
        },
        onItemClick (item) {
            this.current = item
        },
        onClose () {
            this.isPlay = false
            this.isExpand = true
        }
    }
}
</script>
