import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiUrl } from '@/api/baseUrl'
import { ElMessage } from 'element-plus'
const defaults = {
  player: {
    showCover: false,
    loading: false,
    muted: false,
    withLyric: false,
    visualizer: true, // 歌词可视化
    random: false,
    loop: false,
    paused: true,
    playBar: 'middle',
    volume: 0.5,
    currentTime: 0,
    duration: 100,
    playBars: [
      { label: 'mini', value: 'small' },
      { label: '中等', value: 'middle' },
      { label: '全宽(移动端默认)', value: 'full' },
    ]
  },
  source: {
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
  },
  playData: {
    url: '',
    type: 'qq',
    title: '',
    img_url: '',
    singer: '',
    playlist: [],
    lyric: '',
    playIndex: 0,
    lyricIndex: 0,
    lyricList: []
  }
}
export const usePlayerStore = defineStore(
  'player',
  () => {
    const player = ref(JSON.parse(JSON.stringify(defaults.player)))
    const source = ref(JSON.parse(JSON.stringify(defaults.source)))
    const playData = ref(JSON.parse(JSON.stringify(defaults.playData)))
    const initPlay = () => {
      player.value.paused = true
      // playData.value.url && play(playData.value)
    }
    const play = async (item, type = playData.value.type || 'qq') => {
      playData.value.currentTime = 0
      if (!item) return ElMessage.error('请选择歌曲')
      playData.value.type = type
      playData.value.id = item.id
      playData.value.title = item.title
      playData.value.img_url = item.img_url
      playData.value.singer = item.singer || item.artist
      player.value.loading = true
      await fetch(`${apiUrl}/music/lyric?id=${item.id}&type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          playData.value.lyric = data.data.lyric
          let lyricArr = computed(() => {
            if (!playData.value.lyric) return ['[00:00]纯音乐，请欣赏~']
            return playData.value?.lyric
              ?.trim()
              ?.split('\n')
              .filter((_) => _ && _.split(']')[1])
          })
          setPlayData({
            lyricList: lyricArr,
          })
        })
      let url = `${apiUrl}/music/url?id=${item.id}&type=${type}`
      if (source.value.id && source.value.apiKey) url += `&apiUrl=${source.value.apiUrl}&apiKey=${source.value.apiKey}`
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
          player.value.muted = false
          player.value.paused = false
          return true
        }).catch(() => {
          playData.value.url = ''
          playData.value.paused = true
          return false
        }).finally(() => {
          player.value.loading = false
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
      if (data.withLyric) {
        setTimeout(() => {
          player.value.withLyric = false
        }, 100)
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
    return { defaults, source, player, playData, initPlay, play, setPlayData, setPlayer, setSource, removeSource }
  },
  {
    persist: true,
  },
)
