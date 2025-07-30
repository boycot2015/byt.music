import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
const affixs = [{
  name: '工作台',
  url: '',
  icon: 'Monitor',
  affix: true
}]
const defaults = [
  ...affixs,
  {
    name: '每日手记',
    desc: '记录每日所见所闻',
    url: 'https://www.boycot.top/',
    icon: 'IconDocumentation',
  },
  {
    name: 'api文档',
    desc: 'boycot-api文档',
    url: 'https://api-docs.boycot.top',
    icon: 'Document',
  },
  {
    name: 'api看板',
    desc: 'api看板展示，示例展示',
    url: 'https://group.boycot.top/',
    icon: 'DataBoard',
  },
  {
    name: 'blog',
    desc: 'boycot博客',
    url: 'https://blog-new.boycot.top/',
    icon: 'Reading',
  },
  {
    name: 'blog-admin',
    desc: 'boycot博客后台',
    url: 'https://blog-admin.boycot.top/',
    icon: 'User',
  },
  {
    name: 'AI导航',
    url: 'https://nav.boycot.top/',
    icon: 'Search',
  },
  {
    name: 'bytMusic',
    url: 'https://music.boycot.top/',
    icon: 'Headset'
  },
  {
    name: '百度',
    desc: '百度一下，你就知道',
    url: 'https://www.baidu.com/',
    closable: true,
    icon: 'IconBaidu',
  },
  {
    name: '高德地图',
    desc: '高德地图，想去哪就去哪',
    url: 'https://map.amap.com/',
    icon: 'IconAmap',
    closable: true,
  }
].map((item) => {
  item.id = Math.random().toString(36).substring(2, 10)
  return item
})
export const useAppStore = defineStore(
  'app',
  () => {
    const apps = ref([...defaults].filter(el => !el.closable).map(el => ({ ...el, closable: !el.affix, editable: !el.affix })))
    const recommended = ref([...defaults])
    const tabs = ref(apps.value.filter((item) => item.affix) || [])
    const current = ref(tabs.value[0]?.id || '')
    const total = computed(() => apps.value.length)
    function add(el, action = 'tabs') {
      if (has(el.id)) return
      if (action === 'apps') apps.value.push({ ...el, id: el.id || Math.random().toString(36).substring(2, 10), closable: true, editable: true })
      if (action === 'tabs') tabs.value.push({ ...el, closable: true, editable: true })
      if (action === 'tabs') current.value = tabs.value[0]?.id || ''
    }
    function remove(id, action = 'tabs') {
      if (action === 'apps') apps.value = apps.value.filter((item) => item.id != id)
      if (action === 'tabs') tabs.value = tabs.value.filter((item) => item.id != id)
      if (action === 'tabs' && current.value === id) current.value = tabs.value[tabs.value.length - 1]?.id || ''
    }
    function update(row) {
      if (!has(row.id, 'apps')) {
        add(row, 'apps')
        return
      } else {
        apps.value = apps.value.map((el) => {
          if (el.id == row.id) {
            return { ...el, ...row }
          }
          return el
        })
      }
      tabs.value = tabs.value.map((el) => {
        if (el.id == row.id) {
          return { ...el, ...row }
        }
        return el
      })
    }
    function has(id, action = 'tabs') {
      if (action === 'tabs') return !!tabs.value.find((item) => item.id == id)
      return !!apps.value.find((item) => item.id == id)
    }
    function setCurrent(id) {
      current.value = id || ''
    }
    function set(arr, action = 'tabs') {
      if (action === 'apps') apps.value = arr
      if (action === 'tabs') tabs.value = arr
      if (action === 'tabs') current.value = tabs.value[tabs.value.length - 1]?.id || ''
    }
    return { apps, recommended, tabs, total, current, add, update, has, remove, set, setCurrent }
  },
  { persist: true },
)
