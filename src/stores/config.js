import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore(
  'config',
  () => {
    const config = ref({
      theme: 'dark',
      title: 'BytMusic',
      types: [
        { title: '企鹅音乐', type: 'qq' },
        { title: '网易音乐', type: 'netease' },
        { title: '酷狗音乐', type: 'kugou' },
        { title: '酷我音乐', type: 'kuwo' },
        { title: '千千音乐', type: 'qianqian' },
        { title: '咪咕音乐', type: 'migu' },
      ],
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
