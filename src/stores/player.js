import { ref, watch, computed } from 'vue'
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
    lyricAlign: 'left',
    quality: '128k'
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
    const audioRef = ref(null)
    const analyser = ref(null)
    const audioSrc = ref(null)
    const lyricList = computed(() => playData.value.lyricList)
    const initPlay = () => {
      audioRef.value = new Audio()
      audioRef.value.crossOrigin = 'anonymous'
      audioRef.value.autoplay = true
      player.value.paused = true
      audioRef.value.addEventListener('timeupdate', () => {
        onUpdate()
      })
      audioRef.value.addEventListener('ended', () => {
        playNext()
      })
      audioRef.value.addEventListener('play', () => {
        if (analyser.value) {
          return
        }
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext
        let audioCtx = new AudioContext()
        analyser.value = audioCtx.createAnalyser()
        audioSrc.value = audioCtx.createMediaElementSource(audioRef.value)
        audioSrc.value.connect(analyser.value)
        analyser.value.connect(audioCtx.destination)
      })
    }
    const play = async (item, type = playData.value.type || 'qq') => {
      playData.value.currentTime = 0
      if (!item) return ElMessage.error('请选择歌曲')
      playData.value.type = type
      playData.value.id = item.id
      playData.value.title = item.title
      playData.value.img_url = item.img_url
      playData.value.singer = item.singer || item.artist
      playData.value.album = item.album || item.album_name
      playData.value.duration = item.duration || item.durationStr
      player.value.loading = true
      fetch(`${apiUrl}/music/lyric?id=${item.id}&type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          playData.value.lyric = data.data.lyric
          let lyricArr = computed(() => {
            if (!playData.value.lyric) return ['[00:00]纯音乐，请欣赏~']
            return playData.value?.lyric
              ?.trim()
              ?.replace(/\r\n/g, '\n').split('\n')
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
            ElMessage({
              type: 'error',
              zIndex: 10000,
              customClass: 'backdrop-blur',
              message: '获取歌曲失败，无法播放此歌曲~',
            })
            playData.value.url = ''
            return false
          }
          playData.value.url = data.data
          player.value.muted = false
          player.value.paused = false
          audioRef.value.src = playData.value.url
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
        if (['volume', 'muted'].includes(key)) {
          audioRef.value[key] = data[key]
        }
      }
      
      if (data.withLyric) {
        setTimeout(() => {
          player.value.withLyric = false
        }, 200)
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
    const playNext = () => {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
      setPlayer({ currentTime: 0, duration: 0, paused: true })
      if (playData.value.playIndex === playData.value.playlist.length - 1 && !player.value.random) return
      if (player.value.random) {
        setPlayData({ playIndex: Math.floor(Math.random() * (playData.value.playlist.length - 1)), lyricIndex: 0 })
      } else {
        setPlayData({ playIndex: (playData.value.playIndex || 0) + 1, lyricIndex: 0 })
      }
      play(playData.value.playlist[playData.value.playIndex]).then((success) => {
        if (success) {
          audioRef.value.src = playData.value.url
          audioRef.value.play()
          setPlayer({ paused: false })
        } else {
          audioRef.value.pause()
        }
      })
    }
    const playPrev = () => {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
      setPlayer({ currentTime: 0, duration: 0, paused: true })
      if (playData.value.playIndex === 0 && !player.value.random) return
      if (player.value.random) {
        setPlayData({ playIndex: Math.floor(Math.random() * (playData.value.playlist.length - 1)), lyricIndex: 0 })
      } else {
        setPlayData({ playIndex: (playData.value.playIndex || 0) - 1, lyricIndex: 0 })
      }
      play(playData.value.playlist[playData.value.playIndex]).then((success) => {
        if (success) {
          audioRef.value.src = playData.value.url
          audioRef.value.play()
          setPlayer({ paused: false })
        } else {
          audioRef.value.pause()
        }
      })
    }
    const togglePlay = () => {      
      if (!playData.value.url) return
      setPlayer({ paused: !player.value.paused })
      if (audioRef.value.paused) {
        if (!audioRef.value.src) {
          audioRef.value.src = playData.value.url
        }
        audioRef.value.currentTime = player.value.currentTime || 0
        audioRef.value.play()
      } else {
        setPlayer({ currentTime: player.value.currentTime })
        audioRef.value.pause()
      }
    }
    const onUpdate = () => {
      if (player.value.withLyric || !audioRef.value) return
      setPlayer({
        duration: audioRef.value.duration || player.value.duration || 0,
        currentTime: player.value.loading ? 0 : audioRef.value.currentTime,
      })
    }
    watch(playData.value, () => {
      if (!player.value || !audioRef.value) return
      if (!player.value.paused && !player.value.currentTime && playData.value.url && !player.value.loading) {
        audioRef.value.play()
      }
    })
    watch(player.value, (val) => {
      if (!player.value || !audioRef.value) return
      if (val.withLyric) {
        audioRef.value.currentTime = player.value.currentTime || 0
      }
      let timeArr = lyricList.value?.filter((el) => el).map((el) => el.split(']')[0]?.split('[')[1]?.split('.')[0] || '0:00') || []
      let timeStr1 = player.value?.currentTime / 60 > 10 ? Math.floor(player.value?.currentTime / 60) : `0${Math.floor(player.value?.currentTime / 60)}`
      let timeStr2 = player.value?.currentTime % 60 > 10 ? Math.floor(player.value?.currentTime % 60) : `0${Math.floor(player.value?.currentTime % 60)}`
      let timerStr = `${timeStr1}:${timeStr2}`
      let index = timeArr.filter((el) => el).findIndex((_) => _ === timerStr)
      index !== -1 && setPlayData({ lyricIndex: index })
    })
    return {
      audioRef,
      analyser,
      defaults,
      source,
      player,
      playData,
      initPlay,
      play,
      setPlayData,
      setPlayer,
      setSource,
      removeSource,
      togglePlay,
      playNext,
      playPrev
    }
  },
  {
    persist: {
      pick: ['source', 'player', 'playData'],
    },
  },
)