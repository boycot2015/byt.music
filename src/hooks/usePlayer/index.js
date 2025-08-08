import { computed, ref, nextTick, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
export const usePlayer = () => {
    const playerStore = usePlayerStore()
    const { initPlay, play, setPlayData, setPlayer } = playerStore
    const player = computed(() => usePlayerStore().player)
    const playData = computed(() => usePlayerStore().playData)
    const audioRef = ref(new Audio(playData.value.url))
    const lyricList = computed(() => playData.value.lyricList)
    const initPlayer = () => {
        audioRef.value.crossOrigin = 'anonymous'
        audioRef.value.preload = 'auto'
        audioRef.value.autoplay = true
        initPlay()
        setPlayerData({
          volume: player.value.volume,
          currentTime: player.value.currentTime,
          loop: player.value.loop,
          paused: player.value.paused,
          src: playData.value.url,
          muted: player.value.muted,
        })
        audioRef.value.addEventListener('canplaythrough', () => {
          console.log('canplaythrough')
        })
        // console.log(audioRef.value, 'audioRef.value');
        
    }
    const setPlayerData = (data) => {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(audioRef.value, key)) {
          audioRef.value[key] = data[key]
        }
      }
    }
    const playNext = () => {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
      setPlayer({ currentTime: 0, duration: 0 })
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
        } else {
          setPlayer({ paused: true })
          audioRef.value.pause()
        }
      })
    }
    const playPrev = () => {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
      setPlayer({ currentTime: 0, duration: 0 })
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
        } else {
          setPlayer({ paused: true })
          audioRef.value.pause()
        }
      })
    }
    const togglePlay = () => {
      if (!playData.value.url) return
      setPlayer({ paused: !player.value.paused })
      setPlayerData({ paused: !player.value.paused })
      if (audioRef.value.paused) {
        if (!audioRef.value.src) {
          audioRef.value.src = playData.value.url
        }
        audioRef.value.play()
        audioRef.value.ontimeupdate = () => {
          console.log(audioRef.value.currentTime);
          setPlayer({ currentTime: audioRef.value.currentTime })
        }
      } else {
        setPlayer({ currentTime: audioRef.value.currentTime })
        audioRef.value.pause()
      }
    }
    const onUpdate = () => {
      setPlayer({
        duration: audioRef.value.duration || player.value.duration || 0,
        currentTime: player.value.loading ? 0 : audioRef.value.currentTime,
      })
    }
    watch(playData.value, () => {
      if (!player.value.paused && !player.value.currentTime && playData.value.url && !player.value.loading) {
        audioRef.value.play()
      }
    })
    watch(player.value, (val) => {
      if (val.withLyric) {
        audioRef.value.currentTime = player.value.currentTime || 0
      }
      let timeArr = lyricList.value?.filter((el) => el).map((el) => el.split(']')[0]?.split('[')[1]?.split('.')[0] || '0:00') || []
      let timeStr1 = player.value?.currentTime / 60 > 10 ? Math.floor(player.value?.currentTime / 60) : `0${Math.floor(player.value?.currentTime / 60)}`
      let timeStr2 = player.value?.currentTime % 60 > 10 ? Math.floor(player.value?.currentTime % 60) : `0${Math.floor(player.value?.currentTime % 60)}`
      let timerStr = `${timeStr1}:${timeStr2}`
      let index = timeArr.findIndex((_) => _ === timerStr)
      index !== -1 && setPlayData({ lyricIndex: index })
    })
    return {
        audioRef,
        initPlayer,
        playNext,
        playPrev,
        togglePlay,
        onUpdate,
    }
}