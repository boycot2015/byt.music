import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCollectStore = defineStore(
  'collect',
  () => {
    const collect = ref([])
    const current = ref('0')
    const total = computed(() => collect.value.length)
    function add(el) {
      current.value = '0'
      collect.value.unshift({ ...el, showClose: false })
    }
    function remove(id) {
      collect.value = collect.value.filter((item) => item.info.id != id)
      current.value = '0'
    }
    function update(row) {
      if (row && row instanceof Array && !row.length) {
        collect.value = []
        return
      }
      collect.value = collect.value.map((el) => {
        if (el.info.id == row.info.id) {
          return { ...el, ...row }
        }
        return el
      })
    }
    function has(id) {
      return !!collect.value.find((item) => item.info.id == id)
    }
    function setCurrent(index) {
      current.value = collect.value[index] ? index : '0'
    }
    return { collect, total, current, add, update, has, remove, setCurrent }
  },
  { persist: true },
)
