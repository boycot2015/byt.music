<script name="Layout" setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Aside from './Aside.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
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
    <el-aside width="64px" class="bg-[transparent] h-[100vh]">
      <Aside />
    </el-aside>
    <el-container class="overflow-hidden">
      <el-header class="bg-[transparent] flex items-center border-b-[1px] border-[#ccc]"><Header /></el-header>
      <el-main class="bg-[transparent] m-[10px] !p-[10px] !overflow-hidden">
        <el-scrollbar always style="height: calc(100vh - 160px)">
          <div class="main scrollbar-wrapper">
            <router-view v-slot="{ Component }">
              <transition name="slide-fade">
                <keep-alive :include="keepAliveRoutes">
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-scrollbar>
      </el-main>
      <el-footer class="bg-[transparent] flex items-center border-t-[1px] border-[#ccc]">
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.scrollbar-wrapper {
  // display: flex;
  width: fit-content;
  width: 100%;
  min-width: 800px;
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
</style>
