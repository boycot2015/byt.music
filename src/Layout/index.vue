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
      <el-header class="bg-[var(--el-bg-color)] flex items-center border-b-[1px] border-[var(--el-menu-border-color)]"><Header /></el-header>
      <el-main class="bg-[transparent] !p-[10px] !overflow-hidden">
        <el-scrollbar always style="height: calc(100vh - 160px)" class="hidden md:block">
          <div class="main scrollbar-wrapper min-w-[768px]">
            <router-view v-slot="{ Component }">
              <transition name="slide-fade">
                <keep-alive :include="keepAliveRoutes">
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-scrollbar>
        <div class="main overflow-hidden md:hidden h-[calc(100vh-140px)]">
          <router-view v-slot="{ Component }">
            <transition name="slide-fade">
              <keep-alive :include="keepAliveRoutes">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-main>
      <el-footer class="bg-[var(--el-bg-color)] flex items-center border-t-[1px] border-[var(--el-menu-border-color)] !px-3">
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
