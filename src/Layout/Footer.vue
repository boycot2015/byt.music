<template>
  <div class="footer flex items-center justify-between w-full">
    <div class="left flex flex-1 cursor-pointer">
      <el-image :src="playData.img_url" fit="fill" class="w-10 h-10 mr-2" />
      <div class="info">
        <div class="title line-clamp-1">{{ playData.title }}</div>
        <div class="singer text-xs line-clamp-1">{{ playData.singer }}</div>
      </div>
    </div>
    <audio ref="audioRef" class="flex-3" controls autoplay :loop="false" :muted="muted" :key="url" :src="url" @ended="handleEnded" @playing="paused = false" @pause="paused = true">
    </audio>
    <div class="controls flex justify-end flex-1 ml-5">
      <el-icon :size="38">
        <IconPrev class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="togglePlay" v-if="paused">
        <IconPlay class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="togglePlay" v-else>
        <IconPause class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38">
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
const paused = ref(true)
const muted = ref(true)
const url = computed(() => playData.url)
const handleEnded = () => {
  // playing ended
  setPlayData({ playIndex: (playData.playIndex || 0) + 1 })
  play(playData.playlist[playData.playIndex])
}
const togglePlay = () => {
  if (audioRef.value.paused) {
    audioRef.value.play()
    paused.value = false
  } else {
    audioRef.value.pause()
    paused.value = true
  }
}
onMounted(() => {
  nextTick(() => {
    initPlay(audioRef.value)
    muted.value = false
  })
})
</script>
