<template>
  <div>
    <el-slider
      :class="{ '!w-[200px]': !config.isMobile && player.playBar == 'small' }"
      size="small"
      class="!h-[5px] text-center"
      :disabled="disabled"
      v-model="player.currentTime"
      :min="0"
      :format-tooltip="formatTime"
      :max="player.duration"
      @input="(val) => (inputValue = val)"
      @change="onSliderChange"
    />
  </div>
</template>
<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['change'])
const playerStore = usePlayerStore()
const { playData, initPlay, play, setPlayData, setPlayer } = playerStore
const player = computed(() => usePlayerStore().player)
const config = computed(() => useConfigStore().config)
const inputValue = ref(0)
const formatTime = (str = player.value.currentTime, type = 'time') => {
  if (type === 'percent') return str * 100
  return `${Math.floor((str || 0) / 60)}:${('0' + Math.floor((str || 0) % 60)).slice(-2)}`
}
watch(player.value, () => {
  // console.log('playData', player.value)
})
const onSliderChange = (val) => {
  emit('change', val)
  // setPlayer({ currentTime: val })
  nextTick(() => {
    emit('change', inputValue.value)
    setPlayer({ currentTime: inputValue.value })
  })
}
</script>