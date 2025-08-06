
<template>
  <canvas id="visualizer" width="1920" height="200"></canvas>
</template>
<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
const { setPlayer } = usePlayerStore()
const config = computed(() => useConfigStore().config)
const player = computed(() => usePlayerStore().player)
const playData = computed(() => usePlayerStore().playData)
const myRequest = ref(null)
const init = () => {
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
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext
  var audio = document.getElementById('audio')
  var ctx = new AudioContext()
  var analyser = ctx.createAnalyser()
  var audioSrc = ctx.createMediaElementSource(audio)
  // we have to connect the MediaElementSource with the analyser
  audioSrc.connect(analyser)
  analyser.connect(ctx.destination)
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
  // analyser.fftSize = 64;
  // frequencyBinCount tells you how many values you'll receive from the analyser
  // var frequencyData = new Uint8Array(analyser.frequencyBinCount)

  // we're ready to receive some data!
  var canvas = document.getElementById('visualizer')
  var cwidth = canvas.width
  var cheight = canvas.height - 2
  var meterWidth = 12 // width of the meters in the spectrum
  var gap = 2 // gap between meters
  var capHeight = 2
  var meterNum = (cwidth * 1.5) / (meterWidth + gap) // count of the meters
  var capYPositionArray = [] /// /store the vertical position of hte caps for the preivous frame
  ctx = canvas.getContext('2d')
  // gradient.addColorStop(0, '#f00')
  // loop
  function renderFrame() {
    var capStyle = config.value.theme.primaryColor || '#fff'
    const gradient = ctx.createLinearGradient(0, 0, 0, 1000)
    gradient.addColorStop(1, config.value.theme.primaryColor || '#0f0')
    gradient.addColorStop(0.5, config.value.theme.primaryColor || '#ff0')
    var array = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(array)
    var step = Math.floor(array.length / meterNum) // sample limited data from the total array
    ctx.clearRect(0, 0, cwidth, cheight)
    for (var i = 0; i < meterNum; i++) {
      var value = array[i * step]
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
  myRequest.value = requestAnimationFrame(renderFrame)
  renderFrame()
}

watch(player.value, () => {
  if (!player.value.visualizer) {
    document.getElementById('visualizer').style.visibility = 'hidden'
    return
  }
  document.getElementById('visualizer').style.visibility = 'visible'
  !player.value.paused && init()
})
onUnmounted(() => {
  cancelAnimationFrame(myRequest.value)
})
onMounted(() => {
  // init()
})
</script>
 <style>
#visualizer {
  bottom: 0;
  left: 50%;
  margin-left: -960px;
  position: absolute;
  opacity: 0.4;
  z-index: 1;
}
</style>