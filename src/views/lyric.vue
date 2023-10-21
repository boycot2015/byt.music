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
        max-width: 1000px;
        width: fit-content;
        height: auto;
        display: block;
        line-height: 40px;
        color: @white;
        border-radius: @border-radius;
        background: transparent;
        overflow: hidden;
        white-space: wrap;
        transition: opacity 0.5s;
        &:hover {
            background: rgba(0, 0, 0, 0.5);
            .header {
                opacity: 1;
            }
        }
        ::v-deep(.header) {
            height: 30px;
            line-height: 30px;
            opacity: 0;
            padding: 0;
            width: 100%;
            margin-bottom: 10px;
            user-select: none;
            overflow: hidden;
        }
        .content {
            padding: 0 20px 20px;
        }
        // /deep/.close {
        //     display: none;
        // }
        /deep/.operate-icon {
            text-align: center;
            font-size: 16px;
            user-select: none;
            width: 180px;
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
