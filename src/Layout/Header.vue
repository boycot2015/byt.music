<template>
  <el-page-header @back="goBack" :icon="route.meta.showBack ? ArrowLeft : ''">
    <template #title>
      <span class="text-large font-600 mr-3" v-if="route.meta.showBack"> 返回 </span>
      <span v-else></span>
    </template>
    <template #content>
      <span class="text-large font-600 mr-3"> {{ route.meta.title }} </span>
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
