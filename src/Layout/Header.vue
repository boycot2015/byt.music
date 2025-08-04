<template>
  <el-page-header @back="goBack" :icon="route.meta.showBack ? ArrowLeft : ''" class="w-full">
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
      <div class="flex items-center">
        <el-icon class="mr-3" :size="24" v-if="route.meta.showBack && route.meta?.icon" @click.stop>
          <component :is="route.meta.icon" />
        </el-icon>
        <span class="text-large font-600"> {{ route.meta.title }} </span>
      </div>
    </template>
    <template #extra>
      <div class="flex">
        <el-switch v-model="isDark" inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="toggleDark" />
      </div>
    </template>
  </el-page-header>
</template>
<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { useConfigStore } from '@/stores/config'
const { config, set } = useConfigStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const router = useRouter()
const route = useRoute()
const goBack = () => {
  router.go(-1)
}
</script>
