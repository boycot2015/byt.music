<template>
  <div class="player leading-[60px] h-[60px] flex flex-1 md:flex-3 items-center justify-around w-full">
    <el-button loading v-if="loading" type="primary" link loading-icon="Loading" class="mr-2"></el-button>
    <el-slider size="small" class="md:flex-3 !h-[auto] !hidden md:!block text-center" :disabled="disabled" v-model="playData.currentTime" :min="0" :format-tooltip="formatTime" :max="playData.duration" @input="(val) => (inputValue = val)" @change="onSliderChange" />
    <audio ref="audioRef" class="flex-3 hidden" :muted="muted" :src="url" :loop="playData.loop" @ended="playNext" @timeupdate="onUpdate" @pause="setPlayData({ paused: true })" @play="setPlayData({ paused: false })"></audio>
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
      <el-popover trigger="click" width="520px">
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
const { playData, initPlay, play, setPlayData } = playerStore
const audioRef = ref(null)
const paused = computed(() => playData.paused)
const muted = computed(() => playData.muted)
const url = computed(() => playData.url)
const loading = ref(false)
const inputValue = ref(0)
const formatTime = () => {
  return `${Math.floor((playData.currentTime || 0) / 60)}:${('0' + Math.floor((playData.currentTime || 0) % 60)).slice(-2)}`
}
const playNext = () => {
  // playing ended
  audioRef.value.currentTime = 0
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
  if (!playData.paused && !playData.currentTime && playData.url) {
    audioRef.value.play()
  }
  if (newVal.withLyric) {
    audioRef.value.currentTime = newVal.currentTime || 0
  }
})
const disabled = computed(() => !playData.url || loading.value)
</script>
