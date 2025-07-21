<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
const { config } = useConfigStore()
const route = useRoute()
const router = useRouter()
const path = ref(route.meta?.menuPath || route.path)
const menus = ref([...router.options.routes.filter((el) => el.meta && el.meta.icon && !el.meta.hideInMenu).map((el) => ({ title: el.meta.title, path: el.path, icon: el.meta.icon }))])
router.afterEach(() => {
  if (route.meta?.menuPath) {
    path.value = route.meta.menuPath
  } else if (route.path !== path.value) {
    path.value = route.path
  }
})
const handleOpen = (key) => {
  path.value = key
  router.push(key)
}
</script>
<template>
  <div class="flex flex-col items-center border-r-[1px] border-[var(--el-menu-border-color)] h-full">
    <router-link to="/" class="logo w-full h-[60px] flex items-center py-2 justify-around" :title="config.title">
      <el-icon :size="32" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
      <div class="title text-2xl hidden">{{ config.title }}</div>
    </router-link>
    <div class="wrapper">
      <el-segmented v-model="path" direction="vertical" :options="menus" size="large" :props="{ label: 'title', value: 'path' }" @change="handleOpen">
        <template #default="scope">
          <div class="flex flex-col items-center gap-2 p-2">
            <el-icon class="text-shadow-2xl" size="20" :title="scope.item.title">
              <component :is="scope.item.icon" />
            </el-icon>
          </div>
        </template>
      </el-segmented>
      <!-- <el-menu class="!block !md:hidden" collapse @select="handleOpen">
        <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
          <el-icon class="text-shadow-2xl" size="20" :title="item.title">
              <component :is="item.icon" />
            </el-icon>
          </el-menu-item>
      </el-menu> -->
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
