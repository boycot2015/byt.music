<template>
  <div class="lyirc">
    <el-scrollbar ref="scrollbar" :height="config.isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 230px)'" @scroll="onScroll">
      <div class="w-full lg:w-[500px] drop-shadow-md">
        <div :ref="(el) => (itemRefs[index] = el)" v-for="(item, index) in lyricArr" :key="item" class="h-[48px]" @click="setSlider(index)">
          <span class="text-xl cursor-pointer line-clamp-1 !text-left transition-all delay-0 duration-300 ease-in-out" :class="{ 'text-[var(--el-color-primary)] !text-2xl ': index === activeIndex }">
            <TextSlider v-show="index === activeIndex" :msg="item.split(']')[1]" />
            <span v-show="index !== activeIndex">{{ item.split(']')[1] }}</span>
          </span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import TextSlider from '@/components/TextSlider/index.vue'
const playerStore = usePlayerStore()
const { config } = useConfigStore()
const { player, playData, setPlayer, setPlayData } = playerStore
const activeIndex = ref(0)
const isScroll = ref(false)
const scrollbar = ref(null)
const scrollTop = ref(0)
const itemRefs = ref([])
let timer = ref(null)
let lyricArr = computed(() => playData.lyricList || [])

let timeArr = lyricArr.value?.filter((el) => el).map((el) => el.split(']')[0]?.split('[')[1]?.split('.')[0] || '0:00') || []
const setSlider = (index) => {
  activeIndex.value = index || activeIndex.value
  if (index) {
    setPlayer({
      withLyric: true,
      currentTime: timeArr[index]?.split(':')[0] * 60 + Number(timeArr[index]?.split(':')[1] || 0),
    })
    nextTick(() => {
      setPlayer({
        withLyric: false,
      })
    })
  }
  if (scrollbar.value && !isScroll.value) {
    if (!player.currentTime && scrollbar.value) {
      activeIndex.value = 0
      scrollbar.value.setScrollTop(0)
      setPlayData({
        lyricIndex: 0,
      })
      return
    }
    let timeStr1 = player?.currentTime / 60 > 10 ? Math.floor(player?.currentTime / 60) : `0${Math.floor(player?.currentTime / 60)}`
    let timeStr2 = player?.currentTime % 60 > 10 ? Math.floor(player?.currentTime % 60) : `0${Math.floor(player?.currentTime % 60)}`
    let timerStr = `${timeStr1}:${timeStr2}`
    let index = timeArr.findIndex((_) => _ === timerStr)
    let elementH = itemRefs.value[activeIndex.value].offsetHeight
    let baseTop = 5 * elementH
    activeIndex.value = index === -1 ? activeIndex.value : index
    if (scrollTop.value > 0 && activeIndex.value * baseTop < scrollTop.value) return
    let top = activeIndex.value * elementH < baseTop ? 0 : activeIndex.value * elementH - baseTop
    if (!player?.currentTime) {
      activeIndex.value = 0
      scrollbar.value.setScrollTop(0)
      setPlayData({
        lyricIndex: 0,
      })
      return
    }
    top &&
      scrollbar.value.scrollTo({
        top,
        left: 0,
        behavior: 'smooth',
      })
    setPlayData({
      lyricIndex: activeIndex.value,
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
watch(player, () => setSlider())

onMounted(() => {
  setSlider()
})
</script>
<style lang="scss" scoped>
:deep(.el-scrollbar__bar) {
  display: none !important;
}
</style>
