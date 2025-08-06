<template>
  <div class="player leading-[60px] h-[60px] flex flex-1 md:flex-3 items-center justify-around w-full">
    <el-carousel :initial-index="playData.lyricIndex" indicator-position="none" :cardScale="0.75" ref="sliderRef" height="60px" v-if="!config.isMobile && !player.showCover" class="flex-1" direction="vertical" type="card" :autoplay="false">
      <el-carousel-item v-for="(item, index) in lyricList" :key="item">
        <h3 class="text-[14px] text-center leading-[30px]" :class="{ 'bg-linear-to-r bg-clip-text from-[var(--el-text-color-regular)] text-transparent to-[var(--el-color-primary)]': index === playData.lyricIndex }">{{ item.split(']')[1] }}</h3>
      </el-carousel-item>
    </el-carousel>
    <div class="md:flex-3 !hidden md:!flex mx-2" :class="{ 'justify-end md:flex-1': player.playBar == 'small' }" v-if="player.playBar != 'full'">
      <div class="flex flex-col items-center justify-center" :class="{ '!flex-row w-full': player.playBar == 'middle' }">
        <span class="leading-[26px] w-10 mr-4" v-show="!player.loading" :class="{ '!order-2 ml-2': player.playBar == 'middle' }">{{ formatTime(player.currentTime) }}/{{ formatTime(player.duration) }}</span>
        <div class="flex w-full">
          <el-button loading v-show="player.loading" type="primary" link loading-icon="Loading" class="mr-2"></el-button>
          <Slider @change="onSliderChange" />
        </div>
      </div>
    </div>
    <audio ref="audioRef" crossorigin="anonymous" id="audio" class="hidden" :muted="muted" :src="url" :volume="player.volume" :loop="player.loop" @ended="playNext" @timeupdate="onUpdate" @pause="setPlayer({ paused: true })" @play="setPlayer({ paused: false })"></audio>
    <div class="controls flex items-center justify-end flex-1 ml-5">
      <div class="mr-3 hidden md:flex items-center">
        <el-icon :size="30" :disabled="disabled">
          <IconInfinity class="cursor-pointer" @click="setPlayer({ loop: false, random: false })" v-if="player.random" />
          <IconLoop class="cursor-pointer" @click="setPlayer({ loop: !player.loop, random: true })" v-else-if="player.loop" />
          <IconListPlay class="cursor-pointer" @click="setPlayer({ loop: !player.loop, random: false })" v-else />
        </el-icon>
      </div>
      <div class="mr-3 hidden md:flex items-center">
        <el-icon :size="30" @click="setPlayer({ muted: !player.muted })" :disabled="disabled">
          <el-popover trigger="hover" popper-class="backdrop-blur">
            <template #reference>
              <IconVolume class="cursor-pointer" v-if="!player.muted" />
              <IconVolumeOff class="cursor-pointer" v-else />
            </template>
            <el-slider :step="0.1" size="small" class="!h-[auto] text-center w-full" v-model="player.volume" :min="0" :format-tooltip="() => formatTime(player.volume, 'percent')" :max="1" @input="(val) => (inputValue = val)" @change="(val) => onSliderChange(val, 'volume')" />
          </el-popover>
        </el-icon>
      </div>
      <el-icon :size="38" @click="playPrev">
        <IconPrev class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="togglePlay" :disabled="disabled">
        <IconPlay class="cursor-pointer" v-if="paused" />
        <IconPause class="cursor-pointer" v-else />
      </el-icon>
      <el-icon :size="38" @click="playNext">
        <IconNext class="cursor-pointer" />
      </el-icon>
      <el-popover trigger="click" :show-arrow="false" popper-class="backdrop-blur" :width="config.isMobile ? '95vw' : '680px'">
        <template #reference>
          <el-icon :size="32">
            <IconListMusic class="cursor-pointer" />
          </el-icon>
        </template>
        <template #default>
          <Playlist :show-header="false" :data="{ info: playData, tracks: playData.playlist }" :tableProps="{ maxHeight: '400px', showHeader: false }" />
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, nextTick, onMounted, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconNext from '@/components/icons/IconNext.vue'
import IconPrev from '@/components/icons/IconPrev.vue'
import IconInfinity from '@/components/icons/IconInfinity.vue'
import IconLoop from '@/components/icons/IconLoop.vue'
import IconListPlay from '@/components/icons/IconListPlay.vue'
import IconListMusic from '@/components/icons/IconListMusic.vue'
import IconVolume from '@/components/icons/IconVolume.vue'
import IconVolumeOff from '@/components/icons/IconVolumeOff.vue'
import Playlist from '@/views/components/Playlist.vue'
import Slider from './components/Slider.vue'

const playerStore = usePlayerStore()
const configStore = useConfigStore()
const { initPlay, play, setPlayData, setPlayer } = playerStore
const player = computed(() => usePlayerStore().player)
const playData = computed(() => usePlayerStore().playData)
const { config } = configStore
const audioRef = ref(null)
const paused = computed(() => player.value.paused)
const muted = computed(() => player.value.muted)
const url = computed(() => playData.value.url)
const lyricList = computed(() => playData.value.lyricList)
const sliderRef = ref(null)
const inputValue = ref(0)
const disabled = computed(() => !playData.value.url || player.value.loading)

const formatTime = (str = player.value.currentTime, type = 'time') => {
  if (type === 'percent') return str * 100
  return `${Math.floor((str || 0) / 60)}:${('0' + Math.floor((str || 0) % 60)).slice(-2)}`
}
const playNext = () => {
  // playing ended
  audioRef.value.pause()
  audioRef.value.currentTime = 0
  setPlayer({ currentTime: 0, duration: 0 })
  if (playData.value.playIndex === playData.value.playlist.length - 1 && !player.value.random) return
  if (player.value.random) {
    setPlayData({ playIndex: Math.floor(Math.random() * (playData.value.playlist.length - 1)), lyricIndex: 0 })
  } else {
    setPlayData({ playIndex: (playData.value.playIndex || 0) + 1, lyricIndex: 0 })
  }
  play(playData.value.playlist[playData.value.playIndex]).then((success) => {
    if (success) {
      audioRef.value.play()
    } else {
      setPlayer({ paused: true })
      audioRef.value.pause()
    }
  })
}
const playPrev = () => {
  audioRef.value.pause()
  audioRef.value.currentTime = 0
  setPlayer({ currentTime: 0, duration: 0 })
  if (playData.value.playIndex === 0 && !player.value.random) return
  if (player.value.random) {
    setPlayData({ playIndex: Math.floor(Math.random() * (playData.value.playlist.length - 1)), lyricIndex: 0 })
  } else {
    setPlayData({ playIndex: (playData.value.playIndex || 0) - 1, lyricIndex: 0 })
  }
  play(playData.value.playlist[playData.value.playIndex]).then((success) => {
    if (success) {
      audioRef.value.play()
    } else {
      setPlayer({ paused: true })
      audioRef.value.pause()
    }
  })
}
const togglePlay = () => {
  if (!playData.value.url) return
  setPlayer({ paused: !player.value.paused })
  if (audioRef.value.paused) {
    audioRef.value.currentTime = player.value.currentTime || 0
    audioRef.value.play()
  } else {
    audioRef.value.pause()
  }
}
const onUpdate = () => {
  setPlayer({
    duration: audioRef.value.duration || player.value.duration || 0,
    currentTime: player.value.loading ? 0 : audioRef.value.currentTime,
  })
  sliderRef.value?.setActiveItem(playData.value.lyricIndex)
}
const onSliderChange = (val, prop = 'currentTime') => {
  audioRef.value[prop] = val
  nextTick(() => {
    setPlayer({
      [prop]: val,
      muted: prop == 'volume' && val === 0,
    })
  })
}
onMounted(() => {
  nextTick(() => {
    initPlay()
    audioRef.value.volume = player.value.volume
  })
})
watch(playData.value, () => {
  if (!player.value.paused && !player.value.currentTime && playData.value.url && !player.value.loading) {
    audioRef.value.play()
  }
  sliderRef.value?.setActiveItem(playData.value.lyricIndex)
})
watch(player.value, (val) => {
  if (val.withLyric) {
    audioRef.value.currentTime = inputValue.value || player.value.currentTime || 0
  }
  let timeArr = lyricList.value?.filter((el) => el).map((el) => el.split(']')[0]?.split('[')[1]?.split('.')[0] || '0:00') || []
  let timeStr1 = player.value?.currentTime / 60 > 10 ? Math.floor(player.value?.currentTime / 60) : `0${Math.floor(player.value?.currentTime / 60)}`
  let timeStr2 = player.value?.currentTime % 60 > 10 ? Math.floor(player.value?.currentTime % 60) : `0${Math.floor(player.value?.currentTime % 60)}`
  let timerStr = `${timeStr1}:${timeStr2}`
  let index = timeArr.findIndex((_) => _ === timerStr)
  index !== -1 && setPlayData({ lyricIndex: index })
})
defineExpose({
  togglePlay,
  playNext,
  playPrev,
  setPlayer: (...args) => onSliderChange(...args),
})
</script>
<style lang="scss" scoped>
.player :deep(.el-slider) {
  .el-slider__bar,
  .el-slider__runway {
    height: var(--el-slider-height);
    // top: -7px;
  }
  .el-slider__button-wrapper {
    display: block;
    // height: 20px;
  }
}
</style>