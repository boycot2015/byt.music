import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore(
  'config',
  () => {
    const config = ref({
      title: 'BytMusic',
      description: '一个基于 Vue3 + Pinia + Element Plus 的音乐播放器',
      theme: {
        primaryColor: '#409eff',
        backgroundColor: '#ffffff',
        backgroundImage: '',
        textColor: '#333333',
      },
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
      if (val.theme) {
        if (val.theme.backgroundImage) {
          document.body.style.background = `url(${val.theme.backgroundImage}) no-repeat center/cover`
        }
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
