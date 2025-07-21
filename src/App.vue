<script setup>
import { RouterView } from 'vue-router'
import Layout from './Layout/index.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'

const { config } = useConfigStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const { set } = useConfigStore()
const router = useRouter()
const keepAliveRoutes = router.options.routes
  .filter((el) => el.meta?.keepAlive)
  .map((el) => el.name)
  .join(',')
const fetchCateData = async () => {
  const response = await fetch(`${$apiUrl}/music/cate`).then((res) => res.json())
  set({ types: response.data.map((el) => ({ ...el, title: el.title + '音乐' })) })
}
fetchCateData()
const setHtmlStyleProp = (color) => {
  /** 变量前缀 */
  const PRE = '--el-color-primary'
  /** 浅色变量前缀 */
  const PRE_LIGHT = `${PRE}-light`
  /** 深色变量前缀 */
  const PRE_DARK = `${PRE}-dark`
  /** 色阶 */
  const Levels = [3, 5, 7, 8, 9]

  /** 白色 */
  const WHITE = '#FFFFFF'
  /** 黑色 */
  const BLACK = '#000000'

  const html = document.documentElement
  /**
   * 混合颜色
   */
  const mix = (color1, color2, weight) => {
    weight = Math.max(Math.min(Number(weight), 1), 0)
    const r1 = parseInt(color1.substring(1, 3), 16)
    const g1 = parseInt(color1.substring(3, 5), 16)
    const b1 = parseInt(color1.substring(5, 7), 16)
    const r2 = parseInt(color2.substring(1, 3), 16)
    const g2 = parseInt(color2.substring(3, 5), 16)
    const b2 = parseInt(color2.substring(5, 7), 16)
    const r = Math.round(r1 * (1 - weight) + r2 * weight)
    const g = Math.round(g1 * (1 - weight) + g2 * weight)
    const b = Math.round(b1 * (1 - weight) + b2 * weight)
    const _r = ('0' + (r || 0).toString(16)).slice(-2)
    const _g = ('0' + (g || 0).toString(16)).slice(-2)
    const _b = ('0' + (b || 0).toString(16)).slice(-2)
    return '#' + _r + _g + _b
  }
  // 设置主要颜色变量 --el-color-primary
  html.style.setProperty(PRE, color)
  // 循环设置色阶颜色
  // --el-color-primary-light-${level}
  Levels.forEach((level) => {
    html.style.setProperty(`${PRE_LIGHT}-${level}`, mix(color, WHITE, level * 0.1))
  })
  // 设置主要暗色
  // --el-color-primary-dark-2
  const dark = mix(color, BLACK, 0.2)
  html.style.setProperty(`${PRE_DARK}-2`, dark)
}
onMounted(() => {
  // Set the primary color from the config store on mount
  setHtmlStyleProp(config.theme.primaryColor)
  document.querySelector(':root').style.setProperty('--el-color-primary', config.theme.primaryColor)
  document.documentElement.style.setProperty('--el-color-primary', config.theme.primaryColor)
  document.body.style.background = `url(${config.theme.backgroundImage}) no-repeat center/cover`
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <Layout>
      <router-view v-slot="{ Component }">
        <keep-alive :include="keepAliveRoutes">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </Layout>
  </el-config-provider>
</template>
