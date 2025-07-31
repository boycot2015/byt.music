import { ref } from 'vue'
import { defineStore } from 'pinia'
import { setHtmlStyleProp } from '@/utils'
const defaults = {
  isMobile: false,
  title: 'BytMusic',
  description: '一个基于 Vue3 + Pinia + Element Plus 的音乐播放器',
  theme: {
    primaryColor: '#409eff',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    textColor: '#333333',
  },
  showAside: false,
  types: [
    { title: '企鹅音乐', type: 'qq' },
    { title: '网易音乐', type: 'netease' },
    { title: '酷狗音乐', type: 'kugou' },
    { title: '酷我音乐', type: 'kuwo' },
    { title: '千千音乐', type: 'qianqian' },
    { title: '咪咕音乐', type: 'migu' },
  ],
  family: 'Microsoft YaHei',
  familys: [
    { label: '微软雅黑', value: 'Microsoft YaHei' },
    { label: '苹方', value: 'PingFang SC' },
    { label: '宋体', value: '宋体' },
    { label: '黑体', value: '黑体' },
    { label: '楷体', value: '楷体' },
  ],
}
export const useConfigStore = defineStore(
  'config',
  () => {
    const config = ref(JSON.parse(JSON.stringify(defaults)))
    const set = (val = {}) => {
      for (const key in val) {
        config.value[key] = val[key]
      }
      if (val.theme) {
        val.theme.primaryColor && setHtmlStyleProp(val.theme.primaryColor)
        document.body.style.background = `url(${val.theme.backgroundImage}) no-repeat center/cover`
      }
      if (val.family) {
        document.documentElement.style.fontFamily = `"${val.family}", sans-serif !important`
      }
    }
    return { defaults, config, set }
  },
  {
    persist: true,
  },
)
