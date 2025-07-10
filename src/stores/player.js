import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiUrl } from '@/api/baseUrl'
import { ElMessage } from 'element-plus'
export const usePlayerStore = defineStore(
  'player',
  () => {
    const player = ref(null)
    const playData = ref({
      url: '',
      type: 'qq',
      title: '',
      duration: 100,
      currentTime: 0,
      playlist: [],
      muted: true,
      paused: true,
      playIndex: 0,
    })
    const initPlay = (audio) => {
      player.value = audio
      playData.value.muted = true
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
      return await fetch(`${apiUrl}/music/url?id=${item.id}&type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          playData.value.currentTime = 0
          if (!data.data) {
            playData.value.paused = true
            player.value.pause()
            ElMessage.error('获取歌曲失败，无法播放此歌曲~')
            playData.value.url = ''
            return false
          }
          playData.value.url = data.data
          playData.value.muted = false
          playData.value.paused = false
          playData.value.duration = player.value.duration
          return true
        })
    }
    const setPlayData = (data = {}) => {
      for (const key in data) {
        playData.value[key] = data[key]
      }
    }
    return { playData, initPlay, play, setPlayData }
  },
  {
    persist: {
      debug: true,
    },
  },
)
