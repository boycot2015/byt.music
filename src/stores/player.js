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
      duration: '',
      playlist: [],
      playIndex: 0,
    })
    const initPlay = (audio) => {
      player.value = audio
      playData.value.playIndex = 0
      playData.value.url && play(playData.value)
    }
    const play = async (item, type = playData.value.type || 'qq') => {
      if (!item) return ElMessage.error('请选择歌曲')
      if (item instanceof Array && item.length > 0) {
        playData.value.playlist = item
        item = item[0]
      }
      playData.value.type = type
      playData.value.id = item.id
      playData.value.duration = item.duration
      playData.value.title = item.title
      playData.value.img_url = item.img_url
      playData.value.singer = item.singer || item.artist
      await fetch(`${apiUrl}/music/url?id=${item.id}&type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          playData.value.url = data.data
          if (!data.data) {
            ElMessage.error('获取歌曲失败，无法播放此歌曲~')
            return
          }
          //   pause()
          player.value.play()
        })
      await fetch(`${apiUrl}/music/lyric?id=${item.id}&type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          playData.value.lyric = data.data.lyric
        })
    }
    const pause = () => {
      player.value.pause()
    }
    const setPlayData = (data = {}) => {
      for (const key in data) {
        playData.value[key] = data[key]
      }
    }
    return { playData, initPlay, play, pause, setPlayData }
  },
  {
    persist: {
      debug: true,
    },
  },
)
