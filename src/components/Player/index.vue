<template>
  <div class="player leading-[60px] h-[60px] flex flex-3 items-center justify-around w-full">
    <el-slider size="small" class="flex-3 text-center" :disabled="!playData.url" v-model="playData.currentTime" :min="0" :format-tooltip="formatTime" :max="playData.duration" @change="audioRef.currentTime = playData.currentTime" />
    <audio ref="audioRef" class="flex-3 hidden" :muted="muted" :src="url" :loop="playData.loop" @ended="playNext" @timeupdate="onUpdate" @pause="setPlayData({ paused: true })" @play="setPlayData({ paused: false })"></audio>
    <div class="controls flex items-center justify-end flex-1 ml-5">
      <el-icon :size="30" :disabled="!playData.url" class="flex items-center mr-5">
        <IconInfinity class="cursor-pointer" @click="setPlayData({ loop: false, random: false })" v-if="playData.random" />
        <IconLoop class="cursor-pointer" @click="setPlayData({ loop: !playData.loop, random: true })" v-else-if="playData.loop" />
        <IconList class="cursor-pointer" @click="setPlayData({ loop: !playData.loop, random: false })" v-else />
      </el-icon>
      <el-icon :size="32" class="mr-5" @click="setPlayData({ muted: !playData.muted })" :disabled="!playData.url">
        <IconVolume class="cursor-pointer" v-if="!playData.muted" />
        <IconVolumeOff class="cursor-pointer" v-else />
      </el-icon>
      <el-icon :size="38" @click="playPrev">
        <IconPrev class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="togglePlay" :disabled="!playData.url">
        <IconPlay class="cursor-pointer" v-if="paused" />
        <IconPause class="cursor-pointer" v-else />
      </el-icon>
      <el-icon :size="38" @click="playNext">
        <IconNext class="cursor-pointer" />
      </el-icon>
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
import IconList from '@/components/icons/IconList.vue'
import IconVolume from '@/components/icons/IconVolume.vue'
import IconVolumeOff from '@/components/icons/IconVolumeOff.vue'
const playerStore = usePlayerStore()
const { playData, initPlay, play, setPlayData } = playerStore
const audioRef = ref(null)
const paused = computed(() => playData.paused)
const muted = computed(() => playData.muted)
const url = computed(() => playData.url)

const formatTime = () => {
  return `${Math.floor((playData.currentTime || 0) / 60)}:${('0' + Math.floor((playData.currentTime || 0) % 60)).slice(-2)}`
}
const playNext = () => {
  // playing ended
  if (playData.playIndex === playData.playlist.length - 1 && !playData.random) return
  if (playData.random) {
    setPlayData({ playIndex: Math.floor(Math.random() * (playData.playlist.length - 1)), currentTime: 0 })
  } else {
    setPlayData({ playIndex: (playData.playIndex || 0) + 1, currentTime: 0 })
  }
  play(playData.playlist[playData.playIndex]).then((success) => {
    if (success) {
      audioRef.value.play()
    } else {
      setPlayData({ paused: true })
      audioRef.value.pause()
    }
  })
}
const playPrev = () => {
  // playing ended
  if (playData.playIndex === 0 && !playData.random) return
  if (playData.random) {
    setPlayData({ playIndex: Math.floor(Math.random() * (playData.playlist.length - 1)), currentTime: 0 })
  } else {
    setPlayData({ playIndex: (playData.playIndex || 0) - 1, currentTime: 0 })
  }
  play(playData.playlist[playData.playIndex]).then((success) => {
    if (success) {
      audioRef.value.play()
    } else {
      setPlayData({ paused: true })
      audioRef.value.pause()
    }
  })
}
const togglePlay = () => {
  if (!playData.url) return
  setPlayData({ paused: !playData.paused })
  if (audioRef.value.paused) {
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
onMounted(() => {
  nextTick(() => {
    initPlay(audioRef.value)
  })
})
watch(playData, () => {
  if (!playData.paused && !playData.currentTime) {
    audioRef.value.play()
  }
})
</script>
