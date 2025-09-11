<template>
  <el-page-header @back="goBack" :icon="route.meta.showBack ? 'ArrowLeft' : ''" class="w-full">
    <template #title>
      <div class="flex items-center">
        <div class="md:hidden flex items-center md:mr-3 mr-[0px]" v-if="route.meta.keepAlive">
          <el-icon :size="24" @click.stop="() => set({ showAside: !config.showAside })">
            <IconMenu />
          </el-icon>
        </div>
        <span class="text-large font-600" v-if="route.meta.showBack"> 返回 </span>
        <el-icon class="md:ml-3 !hidden md:!block" :size="22" v-else-if="route.meta?.icon" @click.stop>
          <component :is="route.meta.icon" />
        </el-icon>
      </div>
    </template>
    <template #content>
      <div class="flex items-center w-full md:w-[500px]">
        <div class="mr-3 flex items-center">
          <el-icon class="mr-3" :size="24" v-if="route.meta.showBack && route.meta?.icon" @click.stop>
            <component :is="route.meta.icon" />
          </el-icon>
          <span class="text-large font-600" v-if="route.meta && (!route.meta.showSearch || !config.isMobile)">{{ route.query.title || route.meta.title }}</span>
        </div>
        <div class="flex-1 relative overflow-hidden z-9" v-if="route.meta && route.meta.showSearch">
          <el-carousel class="!absolute left-10 top-1.2 w-full" :interval="3000" indicator-position="none" ref="sliderRef" height="40px" direction="vertical" :autoplay="true">
            <el-carousel-item v-for="item in hots" :key="item">
              <h3 class="text-[16px] text-left leading-[30px]">{{ item.searchWord }}</h3>
            </el-carousel-item>
          </el-carousel>
          <el-input @click.stop="router.push({ name: 'search' })" placeholder="" class="w-full" prefix-icon="Search"> </el-input>
        </div>
      </div>
    </template>
    <template #extra>
      <div class="flex">
        <el-switch v-model="isDark" size="large" inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="toggleDark" />
      </div>
    </template>
  </el-page-header>
</template>
<style lang="scss" scoped>
:deep(.el-input .el-input__wrapper) {
  border-radius: 100px !important;
}
:deep(.el-page-header__left) {
  flex: 1;
  margin-right: 16px;
}
:deep(.el-page-header__content) {
  flex: 1;
}
</style>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { useConfigStore } from '@/stores/config'
const { proxy } = getCurrentInstance()
const $musicApiUrl = proxy.$musicApiUrl
const hots = ref([])
const { config, set } = useConfigStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const router = useRouter()
const route = useRoute()
const goBack = () => {
  router.go(-1)
}
const fetchData = async () => {
  const response = await fetch(`${$musicApiUrl}/search/hot/detail`).then((res) => res.json())
  hots.value = response.data?.map((el) => ({ ...el, name: el.searchWord }))
}
fetchData()
</script>
