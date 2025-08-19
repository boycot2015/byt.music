<script setup>
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import Layout from './Layout/index.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { usePlayerStore } from '@/stores/player'
import { setHtmlStyleProp } from '@/utils'
const { config } = useConfigStore()
const { playData, initPlay, setPlayer } = usePlayerStore()
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
onMounted(() => {
  // Set the primary color from the config store on mount
  setHtmlStyleProp(config.theme.primaryColor)
  document.body.style.background = `url(${config.theme.backgroundImage}) no-repeat center/cover`
  document.body.style.fontFamily = `${config.family}`
  document.body.classList[config.textShadow ? 'add' : 'remove'](['!text-shadow-md'])
  set({ isMobile: document.body.clientWidth < 768 })
  window.addEventListener('resize', () => {
    set({ isMobile: document.body.clientWidth < 768 })
  })
  initPlay()
})
</script>

<template>
  <el-config-provider
    :locale="zhCn"
    :link="{
      underline: 'never',
    }"
    :experimental-features="{
      modelClass: 'backdrop-blur',
      popoverClass: 'backdrop-blur',
    }"
    :message="{
      max: 2,
      duration: 2000,
      plain: true,
    }"
  >
    <Layout>
      <router-view v-slot="{ Component }">
        <keep-alive :include="keepAliveRoutes">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </Layout>
  </el-config-provider>
</template>
<style lang="scss">
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
// 上面隐藏横向滚动条会导致下拉框底部遮盖问题
.el-select-dropdown .el-scrollbar {
  padding-bottom: 17px;
}
.el-scrollbar__bar.is-horizontal {
  display: none !important;
}
</style>
