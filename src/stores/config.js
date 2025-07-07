import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore(
  'config',
  () => {
    const config = ref({
      theme: 'dark',
      title: 'BytMusic',
    })
    const set = (val = {}) => {
      config.value = {
        ...config.value,
        ...val,
      }
    }
    return { config, set }
  },
  {
    persist: {
      debug: true,
    },
  },
)
