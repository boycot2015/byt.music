<template>
    <div class="color-picker" :style="{...config.attr.style}">
        <div class="color-picker-btn" @click="onPicker">{{config.btnText||'选取颜色'}}</div>
        <input class="color-inner" v-bind="{ ...config.attr }" ref="colorInner" type="color">
    </div>
</template>

<script>
/**
 * author : alex
 * email : 961163829@qq.com
 */
export default {
    props: {
        /* 由父组件传递的默认颜色 */
        config: {
            type: Object,
            default: () => ({
                btnText: '选取颜色',
                attr: {
                    defaultValue: 'defaultValue',
                    disabled: false
                }
            })
        }
    },
    data () {
        return {
            isShowPicker: false,
            color: this.config.attr.defaultValue,
            target: '.color-inner'
        }
    },
    methods: {
        onPicker () {
            this.$refs.colorInner.click()
        }
    },
    mounted () {
        let target = document.querySelector(this.target)
        document.querySelector(this.target).addEventListener('input', (e) => {
            target = e.target
            // console.log(target.value, 'e')
            document.querySelector('.color-picker-btn').innerHTML = target.value
            const root = document.querySelector(':root')
            root !== null && root.setAttribute('style', '--color-picker:' + target.value)
            this.$emit('change', e.target.value)
        })
    }
}
</script>

<style lang="less" scoped>
.color-picker {
    position: relative;
    &-btn {
        padding: 8px 10px;
        border: 1px solid @c-ccc;
        background: var(--color-picker);
        color: @white;
        width: 70px;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;
    }
    .color-inner {
        visibility: hidden;
        font-size: 0px;
        outline: none;
        top: -30px;
        position: absolute;
        height: 0;
        width: 0;
        border: none;
        width: 0;
        color: var(--c-999);
        padding: 0;
    }
}
</style>
