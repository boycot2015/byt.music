import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiUrl } from '@/api/baseUrl'
import { ElMessage } from 'element-plus'
export const usePlayerStore = defineStore(
  'player',
  () => {
    const player = ref({
      showCover: false,
      playBar: 'middle',
      playBars: [
        { label: '小进度条', value: 'small' },
        { label: '中进度条', value: 'middle' },
        { label: '大进度条', value: 'full' },
      ]
    })
    const source = ref({
      apiUrl: apiUrl + '/music/url',
      list: [
        { name: '默认', apiUrl: apiUrl + '/music/url', id: '' },
        {
          allowShowUpdateAlert: true,
          apiKey: 'share-v2',
          apiUrl: 'https://lxmusicapi.onrender.com',
          author: 'Huibq',
          description: 'Github搜索“洛雪音乐音源”，禁止批量下载！',
          homepage: '',
          id: 'user_api_468_1753778736801',
          musicSources: { kw: { name: 'kw', type: 'music', actions: ['musicUrl'], qualitys: ['128k', '320k'] }, },
          name: 'Huibq_lxmusic源',
          version: 'v1.2.0',
        }
      ]
    })
    const playData = ref({
      url: '',
      type: 'qq',
      title: '',
      duration: 100,
      currentTime: 0,
      playlist: [],
      muted: false,
      paused: true,
      withLyric: false,
      playIndex: 0,
    })
    const initPlay = () => {
      playData.value.paused = true
      // playData.value.url && play(playData.value)
    }
    const play = async (item, type = playData.value.type || 'qq') => {
      if (!item) return ElMessage.error('请选择歌曲')
      playData.value.currentTime = 0
      playData.value.type = type
      playData.value.id = item.id
      // playData.value.duration = item.duration
      playData.value.title = item.title
      playData.value.img_url = item.img_url
      playData.value.singer = item.singer || item.artist
      await fetch(`${apiUrl}/music/lyric?id=${item.id}&type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          playData.value.lyric = data.data.lyric
        })
      let url = `${apiUrl}/music/url?id=${item.id}&type=${type}`
      if (source.id && source.apiKey) url += `&apiUrl=${source.apiUrl}&apiKey=${source.apiKey}`
      return await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          playData.value.currentTime = 0
          if (!data.data) {
            playData.value.paused = true
            ElMessage.error('获取歌曲失败，无法播放此歌曲~')
            playData.value.url = ''
            return false
          }
          playData.value.url = data.data
          playData.value.muted = false
          playData.value.paused = false
          return true
        })
    }
    const setPlayData = (data = {}) => {
      for (const key in data) {
        playData.value[key] = data[key]
      }
    }
    const setPlayer = (data = {}) => {
      for (const key in data) {
        player.value[key] = data[key]
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
    return { source, player, playData, initPlay, play, setPlayData, setPlayer, setSource, removeSource }
  },
  {
    persist: {
      debug: true,
    },
  },
)
