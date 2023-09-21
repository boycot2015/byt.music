<template>
    <lyric v-model:isShow="isShow"></lyric>
</template>
<script>
export default {
    data () {
        return {
            isShow: true
        }
    },
    mounted () {
        document.body.style.overflow = 'hidden'
    }
}
</script>
<style lang="less" scoped>
    .lyric {
        position: static;
        font-size: 32px;
        min-width: auto;
        width: 100vw;
        height: 100vh;
        display: block;
        min-height: 80px;
        line-height: 40px;
        color: @white;
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
            user-select: none;
            overflow: hidden;
        }
        .content {
            padding: 0 20px 20px;
        }
        /deep/.close {
            display: none;
        }
        /deep/.operate-icon {
            text-align: center;
            font-size: 16px;
            user-select: none;
            width: 150px;
            margin: 0 auto;
            -webkit-app-region: no-drag;
            .font-icon {
                margin-right: 10px;
                cursor: pointer;
                &::after {
                    user-select: none;
                    color: @white;
                }
            }
        }
    }
</style>
