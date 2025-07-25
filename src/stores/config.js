import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiUrl } from '@/api/baseUrl'
import { ElMessage } from 'element-plus'
export const useConfigStore = defineStore(
  'config',
  () => {
    const config = ref({
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
    })
    const source = ref({
      apiUrl: apiUrl + '/music/url',
      list: [
        { name: '默认', apiUrl: apiUrl + '/music/url', id: '' },
      ]
    })
    const set = (val = {}) => {
      for (const key in val) {
        config.value[key] = val[key]
      }
      if (val.theme) {
        if (val.theme.backgroundImage) {
          document.body.style.background = `url(${val.theme.backgroundImage}) no-repeat center/cover`
        }
      }
      if (val.family) {
        document.documentElement.style.fontFamily = `"${val.family}", sans-serif !important`
      }
    }
    const setSource = (data, msg = '设置成功') => {
      for (const key in data) {
        source.value[key] = data[key]
      }
      ElMessage.success(msg)
    }
    const removeSource = (val) => {
      source.value.list = source.value.list.filter(item => item.id !== val)
      if (source.value.id === val) {
        for (const key in source.value.list[0]) {
          source.value[key] = source.value.list[0][key]
        }
      }
    }
    return { config, source, set, setSource, removeSource }
  },
  {
    persist: {
      debug: true,
    },
  },
)
