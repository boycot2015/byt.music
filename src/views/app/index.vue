<template>
  <div class="app">
    <el-segmented v-model="appId" :disabled="loading" :options="apps" size="large" :props="{ label: 'title', value: 'id' }" @change="loading = true">
      <template #default="{ item }">
        {{ item.title }}
      </template>
    </el-segmented>
    <div class="h-[calc(100vh-190px)] mt-2 rounded overflow-hidden" v-loading="loading">
      <iframe :src="apps.find((item) => item.id === appId).url" frameborder="0" width="100%" height="100%" @load="loading = false"></iframe>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const loading = ref(true)
const appId = ref('1')
const apps = ref([
  {
    title: '每日手记',
    url: 'https://www.boycot.top/',
    icon: 'IconApp',
  },
  {
    title: 'api应用示例',
    url: 'https://group.boycot.top/',
    icon: 'IconApp',
  },
  {
    title: 'AI导航',
    url: 'https://nav.boycot.top/',
    icon: 'IconApp',
  },
  {
    title: 'blog-admin',
    url: 'https://blog-admin.boycot.top/',
    icon: 'IconApp',
  },
  {
    title: 'blog',
    url: 'https://blog-new.boycot.top/',
    icon: 'IconApp',
  },
  {
    title: 'boycot-api',
    url: 'https://api.boycot.top/api-docs',
    icon: 'IconApp',
  },
  {
    title: 'bytMusic',
    url: 'https://music.boycot.top/',
    icon: 'IconApp',
  },
  {
    title: '百度',
    url: 'https://www.baidu.com/',
    icon: 'IconBaidu',
  },
  {
    title: '高德地图',
    url: 'https://map.amap.com/',
    icon: 'IconAmap',
    id: '4',
  },
])
apps.value.map((item) => {
  item.id = Math.random().toString(36).substring(2, 10)
})
appId.value = apps.value[0].id
</script>
