<template>
  <el-page-header @back="goBack" :icon="route.meta.showBack ? ArrowLeft : ''">
    <template #title>
      <div class="flex items-center">
        <span class="text-large font-600" v-if="route.meta.showBack"> 返回 </span>
        <el-icon class="ml-3" :size="22" v-else-if="route.meta?.icon">
          <component :is="route.meta.icon" />
        </el-icon>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <el-icon class="mr-3" :size="24" v-if="route.meta.showBack && route.meta?.icon">
          <component :is="route.meta.icon" />
        </el-icon>
        <span class="text-large font-600"> {{ route.meta.title }} </span>
      </div>
    </template>
  </el-page-header>
</template>
<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const goBack = () => {
  router.push({ path: route.matched[0].path.replace('/:id', ''), query: route.query })
}
</script>
