<template>
  <div class="docker">
      桌面歌词
  </div>
</template>

<script>
import {
    // ref,
    // computed,
    // watch,
    reactive,
    // onMounted,
    // onUpdated,
    toRefs
    // onBeforeMount
    // getCurrentInstance
} from 'vue'
// import {
//     useStore
// } from 'vuex'
// import {
//     useRouter
// } from 'vue-router'
export default {
    setup () {
        const state = reactive({
            deskList: []
        })
        return {
            ...toRefs(state)
        }
    }
}
</script>

<style lang="less" scoped>

</style>
