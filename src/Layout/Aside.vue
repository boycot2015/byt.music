<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
const { config } = useConfigStore()
const route = useRoute()
const router = useRouter()
const path = ref('/playlist')
const menus = ref([
  // { title: '搜索', path: '/search', icon: markRaw(Search) },
  // { title: '歌单', path: '/playlist', icon: markRaw(IconFavicon) },
  // { title: '排行榜', path: '/ranking', icon: markRaw(IconRank) },
  // { title: '收藏', path: '/favorites', icon: markRaw(IconHeart) },
  // { title: '设置', path: '/setting', icon: markRaw(Setting) },
  ...router.options.routes.filter((el) => el.meta && el.meta.icon && !el.meta.hideInMenu).map((el) => ({ title: el.meta.title, path: el.path, icon: el.meta.icon })),
])
// console.log(menus.value, 'route')

watch(route, () => {
  if (menus.value.find((item) => item.path === route.path)) path.value = route.path
})
const handleOpen = (key) => {
  path.value = key
  router.push(key)
}
</script>
<template>
  <div class="flex flex-col items-center border-r-[1px] border-[var(--el-menu-border-color)] h-full">
    <router-link to="/" class="logo w-full h-[60px] flex items-center py-2 justify-around">
      <img alt="Music logo" class="h-10" src="/logo.svg" />
      <div class="title text-2xl hidden">{{ config.title }}</div>
    </router-link>
    <div class="wrapper">
      <el-segmented v-model="path" direction="vertical" :options="menus" size="large" :props="{ label: 'title', value: 'path' }" @change="handleOpen">
        <template #default="scope">
          <div class="flex flex-col items-center gap-2 p-2">
            <el-icon size="20" :title="scope.item.title">
              <component :is="scope.item.icon" />
            </el-icon>
          </div>
        </template>
      </el-segmented>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  font-size: 12px;
  text-align: center;
}
</style>
