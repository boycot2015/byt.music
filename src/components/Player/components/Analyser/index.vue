
<template>
  <canvas id="visualizer" width="1920" height="300"></canvas>
</template>
<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
const { setPlayer } = usePlayerStore()
const audioRef = computed(() => useConfigStore().audioRef)
const config = computed(() => useConfigStore().config)
const player = computed(() => usePlayerStore().player)
const analyser = computed(() => usePlayerStore().analyser)
const playData = computed(() => usePlayerStore().playData)
const myRequest = ref(null)
const ctx = ref(null)
const visualizer = () => {
  /* *
   * audio visualizer with html5 audio element
   *
   * v0.1.0
   *
   * licenced under the MIT license
   *
   * see my related repos:
   * - HTML5_Audio_Visualizer https://github.com/wayou/HTML5_Audio_Visualizer
   * - 3D_Audio_Spectrum_VIsualizer https://github.com/wayou/3D_Audio_Spectrum_VIsualizer
   * - selected https://github.com/wayou/selected
   * - MeowmeowPlayer https://github.com/wayou/MeowmeowPlayer
   *
   * reference: http://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
   */
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
  // analyser.fftSize = 64;
  // frequencyBinCount tells you how many values you'll receive from the analyser
  // let frequencyData = new Uint8Array(analyser.frequencyBinCount)

  // we're ready to receive some data!
  let canvas = document.getElementById('visualizer')
  let cwidth = canvas.width
  let cheight = canvas.height - 2
  let meterWidth = 12 // width of the meters in the spectrum
  let gap = 0 // gap between meters
  let capHeight = 2
  let meterNum = (cwidth * 1.5) / (meterWidth + gap) // count of the meters
  let capYPositionArray = [] /// /store the vertical position of hte caps for the preivous frame
  let ctx = canvas.getContext('2d')
  // gradient.addColorStop(0, '#f00')
  // loop
  function renderFrame() {
    let capStyle = config.value.theme.primaryColor || '#fff'
    const gradient = ctx.createLinearGradient(0, 0, 0, 1000)
    gradient.addColorStop(1, config.value.theme.primaryColor || '#0f0')
    gradient.addColorStop(0.5, config.value.theme.primaryColor || '#ff0')
    let array = new Uint8Array(analyser.value.frequencyBinCount)
    analyser.value.getByteFrequencyData(array)
    let step = Math.floor(array.length / meterNum) // sample limited data from the total array
    ctx.clearRect(0, 0, cwidth, cheight)
    for (let i = 0; i < meterNum; i++) {
      let value = array[i * step]
      if (capYPositionArray.length < Math.round(meterNum)) {
        capYPositionArray.push(value)
      }
      ctx.fillStyle = capStyle
      // draw the cap, with transition effect
      if (value < capYPositionArray[i]) {
        ctx.fillRect(i * (meterWidth + gap), cheight - --capYPositionArray[i], meterWidth, capHeight)
      } else {
        ctx.fillRect(i * (meterWidth + gap), cheight - value, meterWidth, capHeight)
        capYPositionArray[i] = value
      }
      ctx.fillStyle = gradient // set the filllStyle to gradient for a better look
      ctx.fillRect(i * (meterWidth + gap) /* meterWidth+gap */, cheight - value + capHeight, meterWidth, cheight) // the meter
    }
    ctx.closePath()
    myRequest.value = requestAnimationFrame(renderFrame)
  }
  renderFrame()
  audioRef.value && audioRef.value.play()
}

watch(player.value, () => {
  if (!player.value.visualizer) {
    document.getElementById('visualizer').style.visibility = 'hidden'
    return
  }
  document.getElementById('visualizer').style.visibility = 'visible'
  cancelAnimationFrame(myRequest.value)
  !player.value.paused && analyser.value && visualizer()
})
watch(analyser, () => {
  !player.value.paused && visualizer()
})
onUnmounted(() => {
  cancelAnimationFrame(myRequest.value)
})
onMounted(() => {})
</script>
 <style>
#visualizer {
  bottom: 0;
  left: 50%;
  margin-left: -960px;
  position: absolute;
  opacity: 0.2;
  z-index: 1;
}
</style>