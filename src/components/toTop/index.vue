<template>
    <div class="fix-top" :class="{show: scrollTop > clientHeight, hide: scrollTop <= clientHeight}" @click="scrollToTop">返回顶部</div>
</template>

<script>
export default {
    name: 'ToTOP',
    props: {
        selector: {
            type: String,
            default: '.scroll-view'
        }
    },
    data () {
        return {
            clientHeight: 0,
            scrollTop: 0
        }
    },
    mounted () {
        const _this = this
        this.selector && document.querySelector(this.selector).addEventListener('scroll', function () {
            _this.scrollTop = this.scrollTop
            _this.clientHeight = this.clientHeight
        })
    },
    methods: {
        scrollToTop () {
            // eslint-disable-next-line vue/no-mutating-props
            document.querySelector(this.selector).scrollTop = 0
        }
    }
}
</script>
<style lang="less" scoped>
.fix-top {
    position: absolute;
    z-index: 100000;
    bottom: 20px;
    font-size: 14px;
    cursor: pointer;
    background-color: @primary;
    color: @white;
    padding: 5px 10px;
    border-radius: 3px;
    opacity: 0.8;
    right: 30px;
    transition: all 0.3s;
    &.hide {
        opacity: 0;
        transform: translateY(100px);
    }
    &.show {
        opacity: 1;
        transform: translateY(0px);
    }
    &:hover {
        opacity: 0.8;
    }
}
</style>
