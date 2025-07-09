<template>
  <div class="player leading-[60px] h-[60px] flex flex-3 items-center justify-around w-full">
    <el-slider size="small" class="flex-3 text-center" v-model="playData.currentTime" :min="0" :format-tooltip="formatTime" :max="playData.duration" />
    <audio ref="audioRef" class="flex-3 hidden" :currentTime="playData.currentTime" :muted="muted" :src="url" @ended="playNext" @timeupdate="onUpdate" @pause="setPlayData({ paused: true })" @play="setPlayData({ paused: false })"></audio>
    <div class="controls flex justify-end flex-1 ml-5">
      <el-icon :size="38" @click="playPrev">
        <IconPrev class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="togglePlay" v-if="paused">
        <IconPlay class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="togglePlay" v-else>
        <IconPause class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="playNext">
        <IconNext class="cursor-pointer" />
      </el-icon>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, nextTick, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconNext from '@/components/icons/IconNext.vue'
import IconPrev from '@/components/icons/IconPrev.vue'

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
  if (playData.playIndex === playData.playlist.length - 1) return
  setPlayData({ playIndex: (playData.playIndex || 0) + 1, currentTime: 0 })
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
  if (playData.playIndex === 0) return
  setPlayData({ playIndex: (playData.playIndex || 0) - 1, currentTime: 0 })
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
</script>
