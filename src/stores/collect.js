import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useCollectStore = defineStore(
  'collect',
  () => {
    const collect = ref([{
      info: {
        id: 0,
        title: '我的收藏'
      },
      tracks: []
    }])
    const current = ref('0')
    const total = computed(() => collect.value.length)
    function add(el) {
      current.value = '0'
      collect.value.push({ ...el, showClose: false })
    }
    function remove(id, type = 'playlist') {
      if (!id && type == 'song') {
        collect.value[0].tracks = []
        return
      }
      collect.value = collect.value.filter((item) => item.info.id != id)
      current.value = '0'
    }
    function update(row) {
      if (row && row instanceof Array && !row.length) {
        collect.value = [{
          info: {
            id: 0,
            title: '我的收藏'
          },
          tracks: []
        }]
        return
      }
      collect.value = collect.value.map((el) => {
        if (el.info.id == row.info.id) {
          return { ...el, ...row }
        }
        return el
      })
    }
    function has(id, type = 'playlist') {
      if (type == 'song') return !!collect.value[0]?.tracks.find((item) => item.id == id)
      return !!collect.value.find((item) => item.info.id == id)
    }
    function setCurrent(index) {
      current.value = collect.value[index] ? index : '0'
    }
    const toggleCollect = (data, type = 'playlist') => {
      if (data && !data.id) return
      if (type == 'song') {
        let current = collect.value.find((item) => item.info.id == 0)
        if (current?.tracks.find((item) => item.id == data.id)) {
          current.tracks = current.tracks.filter((item) => item.id != data.id)
        } else {
          current.tracks.unshift(data)
          ElMessage.success({
            type: 'success',
            customClass: '!z-10002 backdrop-blur-xl',
            message: '收藏成功'
          })
        }
        collect.value = collect.value?.map(item => {
          if (item.info.id == current.info.id) {
            return {
              ...item,
              tracks: current.tracks
            }
          }
          return item
        })
      }
    }
    return { collect, total, current, add, update, has, remove, toggleCollect, setCurrent }
  },
  { persist: true },
)
