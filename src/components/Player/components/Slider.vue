<template>
  <div>
    <el-slider :class="{ '!w-[200px]': player.playBar == 'small' }" size="small" class="!h-[5px] text-center" :disabled="disabled" v-model="player.currentTime" :min="0" :format-tooltip="formatTime" :max="player.duration" @input="(val) => (inputValue = val)" @change="onSliderChange" />
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['change'])
const playerStore = usePlayerStore()
const { player, playData, initPlay, play, setPlayData, setPlayer } = playerStore
const inputValue = ref(0)
const formatTime = (str = player.currentTime, type = 'time') => {
  if (type === 'percent') return str * 100
  return `${Math.floor((str || 0) / 60)}:${('0' + Math.floor((str || 0) % 60)).slice(-2)}`
}
const onSliderChange = (val) => {
  emit('change', val)
  nextTick(() => {
    emit('change', inputValue.value)
  })
}
</script>