<template>
  <div class="player leading-[60px] h-[60px] flex flex-1 md:flex-3 items-center justify-around w-full">
    <div class="md:flex-3 !hidden md:!flex" :class="{ 'justify-end': player.playBar == 'small' }" v-if="player.playBar != 'full'">
      <el-button loading v-show="loading" type="primary" link loading-icon="Loading" class="mr-2"></el-button>
      <div class="flex flex-col items-center justify-center" :class="{ '!flex-row w-full': player.playBar == 'middle' }">
        <span class="leading-[26px] w-10 mr-4" v-show="!loading" :class="{ '!order-2 ml-2': player.playBar == 'middle' }">{{ formatTime(playData.currentTime) }}/{{ formatTime(playData.duration) }}</span>
        <el-slider :class="{ '!w-[200px]': player.playBar == 'small' }" size="small" class="!h-[auto] text-center" :disabled="disabled" v-model="playData.currentTime" :min="0" :format-tooltip="formatTime" :max="playData.duration" @input="(val) => (inputValue = val)" @change="onSliderChange" />
      </div>
      <audio ref="audioRef" class="hidden" :muted="muted" :src="url" :loop="playData.loop" @ended="playNext" @timeupdate="onUpdate" @pause="setPlayData({ paused: true })" @play="setPlayData({ paused: false })"></audio>
    </div>
    <div class="controls flex items-center justify-end flex-1 ml-5">
      <div class="mr-3 hidden md:flex items-center">
        <el-icon :size="30" :disabled="disabled">
          <IconInfinity class="cursor-pointer" @click="setPlayData({ loop: false, random: false })" v-if="playData.random" />
          <IconLoop class="cursor-pointer" @click="setPlayData({ loop: !playData.loop, random: true })" v-else-if="playData.loop" />
          <IconListPlay class="cursor-pointer" @click="setPlayData({ loop: !playData.loop, random: false })" v-else />
        </el-icon>
      </div>
      <div class="mr-3 hidden md:flex items-center">
        <el-icon :size="30" @click="setPlayData({ muted: !playData.muted })" :disabled="disabled">
          <IconVolume class="cursor-pointer" v-if="!playData.muted" />
          <IconVolumeOff class="cursor-pointer" v-else />
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
      <el-popover trigger="click" popper-class="backdrop-blur" width="360px">
        <template #reference>
          <el-icon :size="32">
            <IconListMusic class="cursor-pointer" />
          </el-icon>
        </template>
        <template #default>
          <Playlist :show-header="false" :data="{ info: playData, tracks: playData.playlist }" :tableProps="{ maxHeight: '400px' }" />
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, nextTick, onMounted, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
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

const playerStore = usePlayerStore()
const { player, playData, initPlay, play, setPlayData } = playerStore
const audioRef = ref(null)
const paused = computed(() => playData.paused)
const muted = computed(() => playData.muted)
const url = computed(() => playData.url)
const loading = ref(false)
const inputValue = ref(0)
const formatTime = (time = playData.currentTime) => {
  return `${Math.floor((time || 0) / 60)}:${('0' + Math.floor((time || 0) % 60)).slice(-2)}`
}
const playNext = () => {
  // playing ended
  audioRef.value.currentTime = 0
  audioRef.value.pause()
  if (playData.playIndex === playData.playlist.length - 1 && !playData.random) return
  if (playData.random) {
    setPlayData({ playIndex: Math.floor(Math.random() * (playData.playlist.length - 1)), currentTime: 0 })
  } else {
    setPlayData({ playIndex: (playData.playIndex || 0) + 1, currentTime: 0 })
  }
  loading.value = true
  play(playData.playlist[playData.playIndex]).then((success) => {
    if (success) {
      audioRef.value.play()
    } else {
      setPlayData({ paused: true })
      audioRef.value.pause()
    }
    loading.value = false
  })
}
const playPrev = () => {
  audioRef.value.currentTime = 0
  audioRef.value.pause()
  if (playData.playIndex === 0 && !playData.random) return
  if (playData.random) {
    setPlayData({ playIndex: Math.floor(Math.random() * (playData.playlist.length - 1)), currentTime: 0 })
  } else {
    setPlayData({ playIndex: (playData.playIndex || 0) - 1, currentTime: 0 })
  }
  loading.value = true
  play(playData.playlist[playData.playIndex]).then((success) => {
    if (success) {
      audioRef.value.play()
    } else {
      setPlayData({ paused: true })
      audioRef.value.pause()
    }
    loading.value = false
  })
}
const togglePlay = () => {
  if (!playData.url) return
  setPlayData({ paused: !playData.paused })
  if (audioRef.value.paused) {
    audioRef.value.currentTime = playData.currentTime || 0
    audioRef.value.play()
  } else {
    audioRef.value.pause()
  }
}
const onUpdate = () => {
  setPlayData({
    duration: audioRef.value.duration,
    currentTime: audioRef.value.currentTime,
  })
}
const onSliderChange = () => {
  audioRef.value.currentTime = inputValue.value
  nextTick(() => {
    setPlayData({
      currentTime: inputValue.value,
    })
  })
}
onMounted(() => {
  nextTick(() => {
    initPlay(audioRef.value)
  })
})
watch(playData, (newVal, oldVal) => {
  if (!playData.paused && !playData.currentTime && playData.url && !loading.value) {
    audioRef.value.play()
  }
  if (newVal.withLyric) {
    audioRef.value.currentTime = newVal.currentTime || 0
  }
})
const disabled = computed(() => !playData.url || loading.value)
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