<script setup>
import { RouterView } from 'vue-router'
import Layout from './Layout/index.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { useRouter } from 'vue-router'
const router = useRouter()
const keepAliveRoutes = router.options.routes
  .filter((el) => el.meta?.keepAlive)
  .map((el) => el.name)
  .join(',')
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
