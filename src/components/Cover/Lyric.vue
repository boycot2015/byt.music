<template>
  <div class="lyirc">
    <el-scrollbar ref="scrollbar" height="400px" @scroll="onScroll">
      <div class="w-[500px] drop-shadow-md">
        <div :ref="(el) => (itemRefs[index] = el)" v-for="(item, index) in lyricArr" :key="item" class="leading-[18px] h-[60px]" @click="setSlider(index)">
          <span class="text-xl cursor-pointer !text-left transition-all delay-0 duration-300 ease-in-out" :class="{ 'text-[var(--el-color-primary)] !text-2xl': index === activeIndex }">{{ item.split(']')[1] }}</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
const playerStore = usePlayerStore()
const { playData, setPlayData } = playerStore
const activeIndex = ref(0)
const isScroll = ref(false)
const scrollbar = ref(null)
const scrollTop = ref(0)
const itemRefs = ref([])
let timer = ref(null)
let lyricArr = computed(() => {
  if (!playData.lyric) return ['[00:00]纯音乐，请欣赏~']
  return playData?.lyric
    ?.trim()
    ?.split('\n')
    .filter((_) => _ && _.split(']')[1])
})

let timeArr = lyricArr.value?.map((el) => el.split(']')[0]?.split('[')[1]?.split('.')[0] || '0:00') || []
const setSlider = (index) => {
  activeIndex.value = index || activeIndex.value
  if (index) {
    setPlayData({
      currentTime: timeArr[index]?.split(':')[0] * 60 + Number(timeArr[index].split(':')[1] || 0),
    })
  }
  if (scrollbar.value && !isScroll.value) {
    if (!playData.currentTime && scrollbar.value) {
      activeIndex.value = 0
      scrollbar.value.setScrollTop(0)
      return
    }
    let timeStr1 = playData?.currentTime / 60 > 10 ? Math.floor(playData?.currentTime / 60) : `0${Math.floor(playData?.currentTime / 60)}`
    let timeStr2 = playData?.currentTime % 60 > 10 ? Math.floor(playData?.currentTime % 60) : `0${Math.floor(playData?.currentTime % 60)}`
    let timerStr = `${timeStr1}:${timeStr2}`
    let index = timeArr.findIndex((_) => _ === timerStr)
    let elementH = itemRefs.value[activeIndex.value].offsetHeight
    let baseTop = 3 * elementH
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
watch(playData, () => setSlider())

onMounted(() => {
  setSlider()
})
</script>
<style lang="scss" scoped>
:deep(.el-scrollbar__bar) {
  display: none !important;
}
</style>
