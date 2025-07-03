<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Aside from './Aside.vue'
import Header from './Header.vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const keepAliveRoutes = router.options.routes
  .filter((el) => el.meta?.keepAlive)
  .map((el) => el.name)
  .join(',')
// console.log(keepAliveRoutes, 'router')
</script>

<template>
  <el-container>
    <el-aside width="64px" class="bg-[var(--vt-c-white)] h-[100vh]">
      <Aside />
    </el-aside>
    <el-container>
      <el-header class="bg-[var(--vt-c-white)] flex items-center"><Header /></el-header>
      <el-main class="bg-[var(--vt-c-white)] m-[10px] !p-[10px] !overflow-hidden">
        <el-scrollbar always style="height: calc(100vh - 160px)">
          <div class="main scrollbar-wrapper">
            <router-view v-slot="{ Component }">
              <keep-alive :include="keepAliveRoutes">
                <transition name="el-fade-in-linear">
                  <component :is="Component" />
                </transition>
              </keep-alive>
            </router-view>
          </div>
        </el-scrollbar>
      </el-main>
      <el-footer class="bg-[var(--vt-c-white)] flex items-center">Footer</el-footer>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.scrollbar-wrapper {
  // display: flex;
  width: fit-content;
  width: 100%;
  min-width: 800px;
}
</style>
