<script name="Layout" setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Aside from './Aside.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useRoute, useRouter } from 'vue-router'

import { useConfigStore } from '@/stores/config'
const { config } = useConfigStore()
const router = useRouter()
const keepAliveRoutes = router.options.routes
  .filter((el) => el.meta?.keepAlive)
  .map((el) => el.name)
  .join(',')
// console.log(keepAliveRoutes, 'router')
</script>

<template>
  <el-container class="text-shadow-2xl">
    <el-aside width="64px" class="h-[100vh] hidden md:block">
      <Aside />
    </el-aside>
    <el-container class="overflow-hidden bg-[var(--el-bg-color)]">
      <el-header class="bg-[var(--el-bg-color)] flex items-center md:shadow-[0_10px_30px_0_rgba(255,255,255,0.1)] dark:shadow-[0_5px_10px_0_rgba(255,255,255,0.1)]"><Header /></el-header>
      <el-main class="bg-[transparent] !overflow-hidden !p-0 layout">
        <el-scrollbar always style="height: calc(100vh - 120px)">
          <div class="scrollbar-wrapper !p-[10px] md:min-w-[700px]">
            <router-view v-slot="{ Component }">
              <transition name="slide-fade">
                <keep-alive :include="keepAliveRoutes">
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
            <el-backtop target=".layout .el-scrollbar__wrap" :bottom="100"></el-backtop>
          </div>
        </el-scrollbar>
      </el-main>
      <el-footer class="bg-[var(--el-bg-color)] flex items-center md:shadow-[0_-10px_30px_0_rgba(255,255,255,0.1)] !px-3">
        <Footer />
      </el-footer>
    </el-container>
    <el-drawer direction="ltr" modal-class="md:hidden" size="40vw" :with-header="false" :z-index="99999" v-model="config.showAside" class="h-[100vh] md:hidden" body-class="!p-0">
      <Aside />
    </el-drawer>
  </el-container>
</template>
<style lang="scss" scoped>
.scrollbar-wrapper {
  // display: flex;
  width: fit-content;
  width: 100%;
  min-height: calc(100vh - 180px);
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
  opacity: 1;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  height: 0;
  transform: translateX(-30px);
}
.el-aside {
  --aside-bg-color: rgba(255, 255, 255, 0.5);
  background-color: var(--aside-bg-color);
}
html.dark .el-aside {
  --aside-bg-color: rgba(0, 0, 0, 0.5);
  background-color: var(--aside-bg-color);
}
</style>
