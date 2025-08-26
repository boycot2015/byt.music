<template>
  <div class="scroll-wrap w-full">
    <span ref="scrollWrap" class="relative">{{ msg || '--' }}</span>
  </div>
</template>
<script setup>
import { usePlayerStore } from '@/stores/player'
import { computed, onUnmounted } from 'vue'
const props = defineProps({
  msg: String,
  duration: {
    type: [Number, String],
    default: 2000,
  },
})
const msg = computed(() => props.msg)
const timer = ref(null)
const timeoutTimer = ref(null)
const { player, playData } = usePlayerStore()
const lyricIndex = computed(() => usePlayerStore().playData.lyricIndex)
const scrollWrap = ref(null)
const repeatCount = ref(0)
const textMove = () => {
  if (scrollWrap.value && scrollWrap.value !== null) {
    timer.value = null
    const step = -1
    if (scrollWrap.value.offsetWidth < scrollWrap.value.parentNode.offsetWidth) {
      scrollWrap.value.style.left = 0 + 'px'
      clearInterval(timer.value)
      return
    } else {
      autoRoll(step)
    }
    timer.value = setInterval(() => {
      autoRoll(step)
    }, 30)
  }
}
const autoRoll = (step) => {
  if (scrollWrap.value.offsetLeft < -scrollWrap.value.offsetWidth + scrollWrap.value.parentNode.offsetWidth) {
    scrollWrap.value.style.left = -scrollWrap.value.offsetWidth + scrollWrap.value.parentNode.offsetWidth + 'px'
    if (scrollWrap.value.offsetLeft > 0) scrollWrap.value.style.left = 0 + 'px'
    clearInterval(timer.value)
    return
  }
  if (scrollWrap.value.offsetLeft >= 0) {
    scrollWrap.value.style.left = -scrollWrap.value.offsetWidth / 2 + 'px'
  }
  scrollWrap.value.style.left = scrollWrap.value.offsetLeft + step + 'px'
}
onUnmounted(() => {
  clearInterval(timer.value)
  clearTimeout(timeoutTimer.value)
})
watch(lyricIndex, () => {
  clearInterval(timer.value)
  clearTimeout(timeoutTimer.value)
  if (!player.paused) {
    timeoutTimer.value = setTimeout(() => {
      textMove()
    }, Math.min(Math.floor(props.duration / 2), 2000))
  }
})
</script>
<style scoped>
.scroll-wrap {
  white-space: nowrap;
}
</style>