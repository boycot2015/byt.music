<template>
  <div class="scroll-wrap">
    <span ref="scrollWrap" class="relative">{{ msg || '--' }}</span>
  </div>
</template>
<script setup>
import { usePlayerStore } from '@/stores/player'
import { computed, onUnmounted } from 'vue'
const props = defineProps({
  msg: String,
  max: {
    type: Number,
    default: 12,
  },
  duration: {
    type: Number,
    default: 30,
  },
})
const msg = computed(() => props.msg)
const timer = ref(null)
const timeoutTimer = ref(null)
const { player, playData } = usePlayerStore()
const lyricIndex = computed(() => usePlayerStore().playData.lyricIndex)
const scrollWrap = ref(null)
const textMove = (max) => {
  if (scrollWrap.value && scrollWrap.value !== null) {
    timer.value = null
    const step = -1
    if (scrollWrap.value.textContent.length <= max) {
      clearInterval(timer.value)
      return
    } else {
      autoRoll(step)
    }
    timer.value = setInterval(() => {
      autoRoll(step)
    }, props.duration)
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
onMounted(() => {})
onUnmounted(() => {
  clearInterval(timer.value)
})
watch(playData, () => {
  clearInterval(timer.value)
  clearTimeout(timeoutTimer.value)
  if (!player.paused) {
    timeoutTimer.value = setTimeout(() => {
      textMove(props.max)
    }, 800)
  }
})
</script>
<style scoped>
.scroll-wrap {
  white-space: nowrap;
}
</style>