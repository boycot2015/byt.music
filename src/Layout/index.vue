<script name="Layout" setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import Aside from './Aside.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Playlist from '@/views/components/Playlist.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import { set, useDark } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/scrollbar'
import { Scrollbar, A11y } from 'swiper/modules'

const swiperInstance = ref(null)
const modules = ref([Scrollbar, A11y])
const scrollbarRef = ref(null)
const loaded = ref(false)
const scrollTop = ref([])
const isDark = useDark()
const { scrollRef, setScrollRef } = useConfigStore()
const playData = computed(() => usePlayerStore().playData)
const player = computed(() => usePlayerStore().player)
const config = computed(() => useConfigStore().config)
const listVisible = ref(playData.value.playlistVisible || false)
const { setPlayer, play, setPlayData } = usePlayerStore()
const router = useRouter()
const route = useRoute()
const activeIndex = ref(config.activeTab || 0)
const tabs = router.options.routes.filter((el) => el.meta?.keepAlive && !el.meta?.hideInTab && !el.meta?.hideInMenu)
const activeTab = ref(tabs[activeIndex]?.name || 'playlist')
const keepAliveRoutes = router.options.routes
  .filter((el) => el.meta?.keepAlive)
  .map((el) => el.name)
  .join(',')
watch(route, (to, from) => {
  if (!scrollTop.value[activeIndex.value] || to.name == from.name) return
  // console.log(scrollbarRef.value, activeIndex.value, 'scrollbarRef?.value')
  scrollTop.value[activeIndex.value] = scrollbarRef.value[activeIndex.value]?.wrapRef?.scrollTop || 0
  if (!to.meta.keepAlive) {
    scrollbarRef.value[activeIndex.value]?.setScrollTop(0)
  }
  scrollbarRef.value[activeIndex.value]?.setScrollTop(!to.meta.keepAlive ? 0 : scrollTop.value[activeIndex.value])
})
watch(activeIndex, () => {
  set({ activeTab: activeIndex.value })
  router.push({ name: activeTab.value })
})
watch(playData.value, () => {
  listVisible.value = playData.value.playlistVisible
})
watch(listVisible, () => {
  setPlayData({ playlistVisible: listVisible.value })
})
const onSwiper = (swiper) => {
  // 打印swiper对象
  swiperInstance.value = swiper
  let index = tabs.findIndex((el) => el.name == activeTab.value)
  activeIndex.value = index == -1 ? activeIndex.value : index
  swiperInstance.value.slideTo(activeIndex.value)
}
const onSlideChange = (value) => {
  if (value.activeIndex == activeIndex.value) return
  nextTick(() => {
    activeTab.value = tabs[value.activeIndex].name
    activeIndex.value = value.activeIndex
  })
}
const onSlideChangeEnd = (value) => {}
const onTabClick = (tab) => {
  nextTick(() => {
    activeIndex.value = tabs.findIndex((el) => el.name == activeTab.value)
    swiperInstance.value.slideTo(activeIndex.value)
  })
}
onMounted(() => {
  setScrollRef(scrollbarRef.value[activeIndex.value])
  nextTick(() => {
    setTimeout(() => {
      loaded.value = true
    }, 300)
    swiperInstance.value?.slideTo(activeIndex.value)
  })
})
router.afterEach(() => {
  if (!route.meta?.keepAlive || route.meta?.hideInTab) {
    return
  }
  activeTab.value = route.name
  let index = tabs.findIndex((el) => el.name == activeTab.value)
  activeIndex.value = index == -1 ? activeIndex.value : index
  swiperInstance.value.slideTo(activeIndex.value)
  set({ activeTab: activeIndex.value })
})
</script>

<template>
  <el-container class="text-shadow-2xl">
    <el-aside width="64px" class="!transition-all !duration-300 h-[100vh] z-999 hidden md:block shadow-[0_0_5px_0_rgba(0,0,0,0.1)]" :class="{ 'md:!shadow-[0_5px_30px_0_rgba(255,255,255,0.1)]': isDark, 'is-leave': player.showCover }">
      <Aside />
    </el-aside>
    <el-container class="overflow-hidden bg-[var(--el-bg-color)]">
      <!-- <el-header class="bg-[var(--el-bg-color)] !px-3 flex items-center shadow-[0_0_5px_0_rgba(0,0,0,0.1)]" :class="{ 'md:!shadow-[0_5px_30px_0_rgba(255,255,255,0.1)]': isDark }"><Header /></el-header>
      <el-main class="bg-[transparent] md:!overflow-hidden !p-0 rounded layout">
        <el-scrollbar style="height: calc(100vh - 120px)" ref="scrollbarRef">
          <div class="scrollbar-wrapper !p-[10px] md:min-w-[700px]">
            <router-view v-slot="{ Component }">
              <transition name="slide-fade">
                <keep-alive :include="keepAliveRoutes">
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
            <el-backtop target=".layout .el-scrollbar__wrap" :bottom="80" :right="15">
              <el-icon><Top /></el-icon>
            </el-backtop>
          </div>
        </el-scrollbar>
      </el-main>
      <el-footer class="bg-[var(--el-bg-color)] z-999 !p-0 shadow-[0_-5px_30px_0_rgba(0,0,0,0.1)]" :class="{ 'md:!shadow-[0_-5px_30px_0_rgba(255,255,255,0.1)]': isDark }">
        <Footer />
      </el-footer> -->
      <el-header class="bg-[var(--el-bg-color)] !px-3 flex items-center shadow-[0_0_5px_0_rgba(0,0,0,0.1)]" :class="{ 'md:!shadow-[0_5px_30px_0_rgba(255,255,255,0.1)]': isDark }"><Header /></el-header>
      <swiper :modules="modules" class="swipper w-full h-full" :space-between="0" @swiper="onSwiper" @slideChangeTransitionStart="onSlideChange" @slideChangeTransitionEnd="onSlideChangeEnd">
        <swiper-slide class="swipper-item h-full" v-for="tab in tabs" :key="tab.name">
          <el-main class="bg-[transparent] md:!overflow-hidden !p-0 rounded layout">
            <el-scrollbar class="md:!h-[calc(100vh-120px)]" :style="{ height: config.showTab ? (config.showPlyerBar ? `calc(100vh - 160px)` : `calc(100vh - 99px)`) : !config.showPlyerBar ? `calc(100vh - 60px)` : `calc(100vh - 120px)` }" ref="scrollbarRef" :class="{ active: tab.name == activeTab }">
              <div class="scrollbar-wrapper !p-[10px] md:min-w-[700px] md:!pb-[10px]">
                <router-view v-slot="{ Component }">
                  <transition :name="!config.isMobile || !route.meta?.keepAlive || route.meta?.hideInTab ? 'slide-fade' : 'fade'">
                    <keep-alive :include="keepAliveRoutes">
                      <component :is="Component" />
                    </keep-alive>
                  </transition>
                </router-view>
              </div>
            </el-scrollbar>
          </el-main>
        </swiper-slide>
      </swiper>
      <el-backtop :key="activeTab" v-if="tabs?.find((el) => el.name == activeTab)" target=".layout .active .el-scrollbar__wrap" class="!z-999" :bottom="120" :right="15">
        <el-icon><Top /></el-icon>
      </el-backtop>
      <el-footer
        @click.prevent
        v-show="config.showPlyerBar"
        class="bg-[var(--el-bg-color)] absolute md:static md:!flex bottom-[38px] md:bottom-0 w-full z-999 md:z-10001 !p-0 shadow-[0_-5px_30px_0_rgba(0,0,0,0.1)]"
        :class="{ 'md:!shadow-[0_-5px_30px_0_rgba(255,255,255,0.1)]': isDark, '!static': !config.showTab }"
      >
        <Footer />
      </el-footer>
      <el-tabs v-if="loaded && config.showTab" :tab-position="'bottom'" @tab-click="onTabClick" v-model="activeTab" stretch class="bg-[var(--el-bg-color)] absolute tabs w-full md:!hidden z-1000 bottom-0 left-0 right-0 px-3">
        <el-tab-pane :label="tab.meta.title" v-for="tab in tabs" :name="tab.name" :key="tab.name">
          <template #label>
            <div class="flex items-center flex-col">
              <el-icon :size="24"><component :is="tab.meta.icon" /></el-icon>
              <!-- <span class="text-xs">{{ tab.meta.title }}</span> -->
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="transition-all duration-300" :class="{ 'translate-y-[30px]': player.showCover && config.isMobile }"></div>
    </el-container>
    <el-drawer v-model="config.showAside" direction="ltr" modal-class="md:hidden backdrop-blur" size="30vw" :with-header="false" :z-index="99999" class="h-[100vh] md:hidden" body-class="!p-0">
      <Aside />
    </el-drawer>
    <el-drawer v-model="player.showCover" :z-index="9999" :modal-class="`!bg-[transparent]`" body-class="!p-0" header-class="text-center" direction="btt" :title="playData.title" size="100%" :with-header="false">
      <div class="relative z-10 backdrop-blur-2xl overflow-hidden">
        <div class="flex w-full items-center px-5 leading-[60px]">
          <div class="close cursor-pointer md:order-2 hover:text-[var(--el-color-primary)]" @click="setPlayer({ showCover: false })">
            <el-icon :size="24">
              <ArrowDown />
            </el-icon>
          </div>
          <div class="flex flex-col md:flex-row flex-1 items-center text-center justify-center">
            <div class="title text-xl line-clamp-1 md:mr-2">{{ playData.title }}<span class="hidden md:inline"> --</span></div>
            <span class="text-xs md:text-xl">{{ playData.singer }}</span>
          </div>
          <el-icon :size="32" v-if="config.isMobile" @click="setPlayData({ playlistVisible: true })">
            <IconListMusic class="cursor-pointer" />
          </el-icon>
        </div>
        <Cover />
        <Analyser />
      </div>
      <div class="bg-cover z-9 absolute top-0 overflow-hidden left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 blur-[100px] transition-all duration-300 ease-in-out" :style="{ backgroundImage: `url(${playData.img_url})` }"></div>
    </el-drawer>
    <el-drawer v-model="listVisible" modal-class="backdrop-blur-sm" trigger="click" :z-index="10001" header-class="!leading-[32px] !p-3 !mb-0" :show-close="false" direction="btt" size="80%" body-class="!p-0" :show-arrow="false" :width="config.isMobile ? '95vw' : '680px'">
      <template #header>
        <span class="total">共{{ playData.playlist.length }}首歌曲</span>
        <el-button type="danger" :disabled="playData.playlist.length === 0" round @click="setPlayData({ playlist: [] })" icon="Delete">清空</el-button>
      </template>
      <Playlist :show-header="false" :data="{ info: playData, tracks: playData.playlist }" :tableProps="{ miniHeight: '200px', showHeader: false }">
        <template #table-action="{ row }">
          <el-link
            type="primary"
            :disabled="playData.playlist.length === 0"
            size="small"
            @click="
              () => {
                setPlayData({ playIndex: playData.playlist?.findIndex((item) => item.id == row.id) })
                play(row)
              }
            "
          >
            <el-icon :size="24">
              <IconPlay />
            </el-icon>
          </el-link>
          <el-link type="danger" :disabled="playData.playlist.length === 0" size="small" @click="setPlayData({ playlist: playData.playlist.filter((item) => item.id !== row.id) })" icon="Delete"></el-link>
        </template>
      </Playlist>
    </el-drawer>
    <!-- <audio :controls="false" crossorigin="anonymous" :src="playData.url" ref="audioRef"></audio> -->
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
.el-footer .is-open {
  animation: slideX 0.3s ease-in forwards;
}
.el-aside.is-leave {
  transition: width 0.3s ease-in forwards;
  width: 0px !important;
}
@keyframes slideX {
  0% {
    width: 64px !important;
  }
  100% {
    width: 0px !important;
  }
}
:deep(.tabs .el-tabs__active-bar) {
  display: none !important;
}
:deep(.tabs .el-tabs__header.is-bottom) {
  margin-top: 0;
}
</style>
