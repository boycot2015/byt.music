import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const state = ref({
    theme: 'dark',
    title: 'BytMusic',
  })
  const set = (val = {}) => {
    state.value = {
      ...state.value,
      ...val,
    }
  }

  return { state, set, persist: true }
})
