<template>
  <div class="wrap" v-if="showWrap" :class="showContent ?'fadein':'fadeout'">{{text}}</div>
</template>

<style scoped>
  .wrap{
    position: fixed;
    left: 50%;
    top:50%;
    z-index: 1000;
    background: rgba(0,0,0,.35);
    padding: 10px;
    border-radius: 5px;
    transform: translate(-50%,-50%);
    color:#fff;
  }
  .fadein {
    animation: animate_in 0.25s;
  }
  .fadeout {
    animation: animate_out 0.25s;
    opacity: 0;
  }
  @keyframes animate_in {
    0% {
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  @keyframes animate_out {
    0% {
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
</style>
<script>
import { onMounted, onUnmounted, reactive, toRefs } from 'vue'
export default {
    props: {
        // ...
        text: {
            type: [String],
            default: '提示内容！'
        },
        showWrap: {
            type: Boolean,
            default: true
        },
        showContent: {
            type: Boolean,
            default: true
        }
    },
    emits: [
        'update:showWrap'
    ],
    setup (props, context) {
        const data = reactive({
            showWrap: false,
            ...props
        })
        onMounted(() => {
            if (props.showWrap) {
                data.showWrap = true
                // 提前 250ms 执行淡出动画(因为我们再css里面设置的隐藏动画持续是250ms)
                data.duration = data.duration || 3000
                setTimeout(() => { data.showContent = false }, data.duration - 1250)
                // 过了 duration 时间后隐藏整个组件
                setTimeout(() => {
                    data.showWrap = false
                    context.attrs.remove()
                }, data.duration)
            }
        })
        onUnmounted(() => {
        })
        return {
            ...toRefs(data)
        }
    }
}
</script>
