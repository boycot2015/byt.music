<script setup>
import { RouterView } from 'vue-router'
import Layout from './Layout/index.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { setHtmlStyleProp } from '@/utils'
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
onMounted(() => {
  // Set the primary color from the config store on mount
  setHtmlStyleProp(config.theme.primaryColor)
  document.body.style.background = `url(${config.theme.backgroundImage}) no-repeat center/cover`
  set({ isMobile: document.body.clientWidth < 768 })
  window.addEventListener('resize', () => {
    set({ isMobile: document.body.clientWidth < 768 })
  })
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
