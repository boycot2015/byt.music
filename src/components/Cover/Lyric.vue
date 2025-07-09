<template>
  <div class="lyirc">
    <el-scrollbar ref="scrollbar" height="400px" @scroll="onScroll">
      <div v-for="(item, index) in lyricArr" :key="item" class="w-[500px] my-[15px]">
        <span class="text-xl cursor-pointer !text-left leading-[20px] transition-all delay-50 duration-400 ease-in-out" :class="{ 'text-red-500 !text-2xl': index === activeIndex }">{{ item.split(']')[1] }}</span>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
const playerStore = usePlayerStore()
const { playData } = playerStore
const activeIndex = ref(0)
const isScroll = ref(false)
const scrollbar = ref(null)
const scrollTop = ref(0)
let timer = ref(null)
let lyricArr = computed(
  () =>
    playData?.lyric
      ?.trim()
      ?.split('\n')
      .filter((_) => _ && _.split(']')[1]) || [],
)

let timeArr = lyricArr.value.map((el) => el.split(']')[0].split('[')[1].split('.')[0])

const setSlider = () => {
  if (scrollbar.value && !isScroll.value) {
    let timeStr1 = playData?.currentTime / 60 > 10 ? Math.floor(playData?.currentTime / 60) : `0${Math.floor(playData?.currentTime / 60)}`
    let timeStr2 = playData?.currentTime % 60 > 10 ? Math.floor(playData?.currentTime % 60) : `0${Math.floor(playData?.currentTime % 60)}`
    let timerStr = `${timeStr1}:${timeStr2}`
    let index = timeArr.findIndex((_) => _ === timerStr)
    let elementH = 40
    let baseTop = 4 * elementH
    activeIndex.value = index === -1 ? activeIndex.value : index
    if (scrollTop.value > 0 && activeIndex.value * baseTop < scrollTop.value) return
    let top = activeIndex.value * elementH < baseTop ? 0 : activeIndex.value * elementH - baseTop
    if (!playData?.currentTime) {
      activeIndex.value = 0
      scrollbar.value.setScrollTop(0)
      return
    }
    top &&
      scrollbar.value.scrollTo({
        top,
        left: 0,
        behavior: 'smooth',
      })
  }
}
const onScroll = ({ scrollTop: top }) => {
  scrollTop.value = top
  isScroll.value = true
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    isScroll.value = false
  }, 1000)
}
watch(playData, setSlider)
watch(playData.currentTime, () => {
  if (!playData.currentTime && scrollbar.value) {
    scrollbar.value.setScrollTop(0)
    scrollbar.value.handleScroll()
  }
})

onMounted(() => {
  setSlider()
})
</script>
<style lang="scss" scoped>
// :deep(.el-scrollbar__bar) {
//   display: none !important;
// }
</style>
