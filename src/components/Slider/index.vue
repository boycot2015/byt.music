<template>
    <div
        class="slider-container"
        :style="sliderStyle"
        @mouseover="pause()"
        @mouseout="play()"
        v-if="list.length"
    >
        <div ref="content" class="slider-content" :class="mask ? 'mask' : ''">
            <div
                :ref="'slider'+index"
                class="slider"
                v-for="(item, index) in list"
                :key="index"
                :class="setClass(index)"
                @click="onClick(index, item)"
                :style="`background-image: url(${item.src || item.pic || item.imageUrl});height: ${height}px;`"
            >
                <div class="badge" :style="`background:${item.titleColor || 'var(--primary-color)'}`">{{
                    item.typeTitle
                }}</div>
            </div>
            <i
                type="left"
                v-show="arrow"
                class="icon-music-left icon-left"
                @click="prev()"
            ></i>
            <i
                type="right"
                v-show="arrow"
                class="icon-music-right icon-right"
                @click="next()"
            ></i>
        </div>
        <div class="dots" v-if="dots">
            <span
                v-for="(item, index) in list"
                :key="index"
                :style="setActiveDot(index)"
                @mouseover="currentIndex = index"
            ></span>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            currentIndex: 0,
            timer: null
        }
    },
    props: {
        list: {
            type: Array,
            default () {
                return []
            }
        },
        width: {
            type: Number
        },
        height: {
            type: Number,
            default: 200
        },
        imgType: {
            type: String,
            default: 'percentage'
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        mask: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        },
        dots: {
            type: Boolean,
            default: true
        },
        arrow: {
            type: Boolean,
            default: true
        },
        color: {
            type: String,
            default: 'var(--primary-color)'
        }
    },
    computed: {
        sliderStyle () {
            return {
                width: this.width ? this.width + 'px' : '100%',
                height: this.height === 0 ? '240px' : this.height + 'px',
                perspective: this.width + 'px',
                backgroundSize:
                    this.imgType === 'percentage' ? '100% 100%' : this.imgType
            }
        },
        sliderHeight () {
            const h =
                document.querySelector('.slider-container') &&
                document
                    .querySelector('.slider-container')
                    .getBoundingClientRect().height
            return `${h * 0.37}px`
        }
    },
    mounted () {
        this.play()
    },
    methods: {
        setClass (i) {
            const next =
                this.currentIndex === this.list.length - 1
                    ? 0
                    : this.currentIndex + 1
            const prev =
                this.currentIndex === 0
                    ? this.list.length - 1
                    : this.currentIndex - 1
            switch (i) {
            case this.currentIndex:
                return 'active'
            case next:
                return 'next'
            case prev:
                return 'prev'
            default:
                return ''
            }
        },
        setBGImg (src) {
            return {
                backgroundImage: `url(${src})`
            }
        },
        setActiveDot (index) {
            return index === this.currentIndex
                ? {
                    backgroundColor: this.color
                }
                : {
                    backgroundColor: '#ccc'
                }
        },
        play () {
            this.pause()
            if (this.autoPlay) {
                this.timer = setInterval(() => {
                    this.next()
                }, this.interval)
            }
        },
        pause () {
            clearInterval(this.timer)
        },
        next () {
            this.currentIndex = ++this.currentIndex % this.list.length
        },
        prev () {
            this.currentIndex =
                this.currentIndex === 0
                    ? this.list.length - 1
                    : this.currentIndex - 1
        },
        onClick (i, item) {
            if (i === this.currentIndex) {
                this.$emit('slider-click', i, item)
            } else {
                const currentClickClassName = this.$refs['slider' + i].classList[1]
                if (currentClickClassName === 'next') {
                    this.next()
                } else {
                    this.prev()
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.slider-container {
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    min-height: 160px;
    text-align: center;
    padding-bottom: 20px;
    margin: auto;
    position: relative;
    .slider-content {
        position: relative;
        width: 100%;
        height: 100%;
        left: 0%;
        top: 0%;
        margin: 0px;
        padding: 0px;
        background-size: inherit;
        perspective: 1000px;
        .slider {
            position: absolute;
            margin: 0;
            padding: 0;
            top: 0;
            left: 50%;
            width: 70%;
            height: 100%;
            transition: 0.4s transform ease-out,
                0.35s filter cubic-bezier(0.32, 0.04, 0.87, 0.65);
            background-color: #fff;
            background-repeat: no-repeat;
            background-position: center;
            background-size: inherit;
            transform: translate3d(-50%, 1px, -80px) scale3d(0.9, 0.9, 1);
            transform-origin: center;
            z-index: 1;
            filter: brightness(0.6);
            cursor: pointer;
            border-radius: var(--box-radius);
            // box-shadow: 0 0 10px var(--c-ccc);
            .badge {
                position: absolute;
                right: -2px;
                bottom: 10px;
                min-width: 20px;
                padding: 0 6px;
                line-height: 20px;
                background: #ddd;
                color: #fff;
                border-radius: 9px 0 0 9px;
                font-size: 12px;
                filter: brightness(0.93);
            }
            &:before {
                position: absolute;
                content: "";
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0);
                transition-delay: 0.1s !important;
                transition: all 0.5s;
            }
            &.active {
                transform: translate3d(-50%, 0, 0);
                filter: brightness(1);
                z-index: 20;
            }
            &.prev {
                transform: translate3d(-76.5%, 0, 0) scale3d(0.9, 0.9, 1);
                z-index: 18;
            }
            &.next {
                transform: translate3d(-23.5%, 0, 0) scale3d(0.9, 0.9, 1);
                z-index: 18;
            }
        }
        &.mask .slider &.prev,
        &.next &:before {
            background-color: rgba(0, 0, 0, 0.5);
        }
        i {
            display: none;
            position: absolute;
            top: 55%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.5);
            z-index: 21;
            cursor: pointer;
            &:hover::after {
                color: #fff;
            }
            &.icon-left::after,
            &.icon-right::after {
                font-size: 30px;
            }
            &.icon-left {
                left: 11px;
            }
            &.icon-right {
                right: 11px;
            }
            &.mask .slider &.prev,
            &.next &:before {
                background-color: rgba(0, 0, 0, 0.5);
            }
        }
        &:hover i {
            padding: 7px;
            border-radius: 50%;
            color: rgba(255, 255, 255, 0.8);
            display: block;
        }
    }

    .dots {
        width: 100%;
        height: 20px;
        span {
            display: inline-block;
            width: 20px;
            height: 2px;
            margin: 1px 3px;
            cursor: pointer;
        }
    }
}
</style>
