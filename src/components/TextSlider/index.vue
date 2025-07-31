<template>
  <div class="text-slider">
    <div class="scroll-wrap relative" ref="scrollWrap">
      <p class="scroll-item">{{ msg || '--' }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps({
  msg: String,
})
let timer: any = null
const scrollWrap = ref<HTMLElement>()
function scroll() {
  let p = scrollWrap.value.getElementsByTagName('p')[0]
  let p_w = p.offsetWidth
  let div_w = scrollWrap.value.offsetWidth
  if (div_w > p_w || !scrollWrap.value) {
    return false
  }

  let step = 10
  timer = setInterval(() => {
    step++
    if (!scrollWrap.value) {
      clearInterval(timer)
      return
    }
    scrollWrap.value.animate({ left: -step + 'px' }, 20)
  }, 30)
}
onMounted(() => {
  scroll()
})
</script>
<style scoped>
.scroll-wrap {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
</style>