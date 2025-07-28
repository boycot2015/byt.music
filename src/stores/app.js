import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore(
  'app',
  () => {
    const apps = ref([{
      name: '首页',
      url: '',
      icon: 'House',
      affix: true
    },
    {
      name: '每日手记',
      url: 'https://www.boycot.top/',
      icon: 'IconApp',
    },
    {
      name: 'api文档',
      url: 'https://api-docs.boycot.top',
      icon: 'IconApp',
    },
    {
      name: 'api应用示例',
      url: 'https://group.boycot.top/',
      icon: 'IconApp',
    },
    {
      name: 'blog',
      url: 'https://blog-new.boycot.top/',
      icon: 'IconApp',
    },
    {
      name: 'blog-admin',
      url: 'https://blog-admin.boycot.top/',
      icon: 'IconApp',
    },
    {
      name: 'AI导航',
      url: 'https://nav.boycot.top/',
      icon: 'IconApp',
    },
    {
      name: 'bytMusic',
      url: 'https://music.boycot.top/',
      icon: 'IconApp',
    },
    {
      name: '百度',
      url: 'https://www.baidu.com/',
      icon: 'IconBaidu',
      closable: true,
    },
    {
      name: '高德地图',
      url: 'https://map.amap.com/',
      icon: 'IconAmap',
      closable: true,
    }
    ].map((item) => {
      item.id = Math.random().toString(36).substring(2, 10)
      return item
    }))
    const tabs = ref(apps.value.filter((item) => item.affix) || [])
    const current = ref(tabs.value[0]?.id || '')
    const total = computed(() => apps.value.length)
    function add(el, prop = 'tabs') {
      if (prop === 'apps') apps.value.push({ ...el, id: Math.random().toString(36).substring(2, 10) })
      if (prop === 'tabs') tabs.value.push({ ...el, closable: true })
      if (prop === 'tabs') current.value = tabs.value[0]?.id || ''
    }
    function remove(id, prop = 'tabs') {
      if (prop === 'apps') apps.value = apps.value.filter((item) => item.id != id)
      if (prop === 'tabs') tabs.value = tabs.value.filter((item) => item.id != id)
      if (prop === 'tabs') current.value = tabs.value[0]?.id || ''
    }
    function update(row, prop = 'tabs') {
      if (prop === 'apps') apps.value = apps.value.map((el) => {
        if (el.id == row.id) {
          return { ...el, ...row }
        }
        return el
      })
      if (prop === 'tabs') tabs.value = tabs.value.map((el) => {
        if (el.id == row.id) {
          return { ...el, ...row }
        }
        return el
      })
    }
    function has(id) {
      return !!tabs.value.find((item) => item.id == id)
    }
    function setCurrent(id) {
      current.value = id || ''
    }
    return { apps, tabs, total, current, add, update, has, remove, setCurrent }
  },
  { persist: true },
)
