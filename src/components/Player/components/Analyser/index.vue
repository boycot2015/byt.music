
<template>
  <canvas id="visualizer" width="1000" height="200"></canvas>
</template>
<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
const { setPlayer } = usePlayerStore()
const player = computed(() => usePlayerStore().player)
const playData = computed(() => usePlayerStore().playData)
const init = () => {
  const audioCtx = new AudioContext()
  const audio = document.createElement('audio')
  const audioSrc = audioCtx.createMediaElementSource(audio)
  const analyser = audioCtx.createAnalyser()
  audio.src = playData.value.url
  const canvas = document.getElementById('visualizer')
  audio.crossOrigin = 'anonymous'
  // audio.play()
  const ctx = canvas.getContext('2d')

  audioSrc.connect(analyser)
  analyser.connect(audioCtx.destination)

  analyser.fftSize = 512

  function initCnv() {
    let size = 1200
    canvas.width = size * 1
    canvas.height = size * 1

    canvas.style.width = size + 'px'
  }
  initCnv()

  function drow(dataArr, maxValue = 255) {
    let cwidth = canvas.width
    let cheight = canvas.height
    let rectW = 3
    let minHeight = 1
    let gap = 2
    let rectNum = dataArr.length

    let grp = ctx.createLinearGradient(0, rectW, 0, cheight)
    grp.addColorStop(1, '#f00')
    grp.addColorStop(0.8, '#565624')
    grp.addColorStop(0.6, '#fff')
    grp.addColorStop(0.4, '#21d573')
    grp.addColorStop(0.2, '#f0f')
    grp.addColorStop(0, '#fff')
    ctx.fillStyle = grp

    ctx.clearRect(0, 0, cwidth, cheight)
    for (let i = 0; i < rectNum; i++) {
      let value = dataArr[i * gap]
      let rectH = Math.round((value * (cheight / 2)) / maxValue || minHeight)
      ctx.fillRect(i * (rectW + gap), cheight, rectW, -rectH)
    }
  }

  function updata() {
    let arr = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(arr)

    drow(arr)
    requestAnimationFrame(updata)
  }
  updata()
}
watch(player.value, () => {
  setPlayer({ visualizer: !player.value.paused })
  init(player.value.paused)
})
onMounted(() => {
  init()
})
</script>
 <style>
#visualizer {
  bottom: 0;
  left: 50%;
  margin-left: -500px;
  position: absolute;
  z-index: 1;
}
</style>