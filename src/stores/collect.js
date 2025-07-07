import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCollectStore = defineStore(
  'collect',
  () => {
    const collect = ref([])
    const total = computed(() => collect.value.length)
    function add(el) {
      collect.value.push(el)
    }
    function remove(el) {
      collect.value = collect.value.filter((item) => item.id != el.id)
    }

    return { collect, total, add, remove }
  },
  { persist: true },
)
