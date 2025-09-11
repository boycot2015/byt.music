<script name="Layout" setup>
import Aside from './Aside.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Playlist from '@/views/components/Playlist.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import { useVideoStore } from '@/stores/video'
import { useDark } from '@vueuse/core'
import { useSwiper } from '@/hooks/useSwiper'

import playlist from '@/views/playlist/index.vue'
import favorites from '@/views/favorites/index.vue'
import app from '@/views/app/index.vue'
import setting from '@/views/setting/index.vue'
import ranking from '@/views/ranking/index.vue'
import videoDetail from '@/views/video/detail.vue'
import { nextTick } from 'vue'

const tabsComponents = {
  playlist,
  favorites,
  app,
  setting,
  ranking,
}
const { Swiper, SwiperSlide, modules, swiperOptions } = useSwiper()
const swiperInstance = ref(null)
const scrollbarRef = ref(null)
const scrollTop = ref([])
const isDark = useDark()
const { scrollRef, setScrollRef, set } = useConfigStore()
const { setVideoPlayerShow } = useVideoStore()
const playData = computed(() => usePlayerStore().playData)
const player = computed(() => usePlayerStore().player)
const config = computed(() => useConfigStore().config)
const showVideoPlayer = computed(() => useVideoStore().showVideoPlayer)
const videoData = computed(() => useVideoStore().videoDetail.playData)

const listVisible = ref(playData.value.playlistVisible || false)
const videoVisible = ref(showVideoPlayer.value || false)
const commitVisible = ref(playData.value.commitVisible)
const lyricAnimationVisible = ref(false)
const { setPlayer, play, setPlayData } = usePlayerStore()
const router = useRouter()
const route = useRoute()
const activeIndex = ref(config.activeTab || 0)
const tabs = router.options.routes.filter((el) => el.meta?.keepAlive && !el.meta?.hideInTab && !el.meta?.hideInMenu)
const activeTab = ref(tabs[activeIndex]?.name || 'playlist')

const scrollStyle = computed(() => ({ height: config.value.showTab ? (config.value.showPlyerBar ? `calc(100vh - 175px)` : `calc(100vh - 115px)`) : !config.value.showPlyerBar ? `calc(100vh - 60px)` : `calc(100vh - 120px)` }))
watch(isDark, () => {
  nextTick(() => swiperInstance.value?.update())
})
const keepAliveRoutes = router.options.routes
  .filter((el) => el.meta?.keepAlive)
  .map((el) => el.name)
  .join(',')
watch(route, (to, from) => {
  // console.log(scrollbarRef.value[activeIndex.value], to.name, from.name, activeIndex.value, 'scrollbarRef?.value')
  if (!to.meta.keepAlive) {
    scrollbarRef.value[activeIndex.value]?.setScrollTop(0)
  }
  if (!scrollTop.value[activeIndex.value] || to.name == from.name) return
  scrollTop.value[activeIndex.value] = scrollbarRef.value[activeIndex.value]?.wrapRef?.scrollTop || 0
  scrollbarRef.value[activeIndex.value]?.setScrollTop(!to.meta.keepAlive ? 0 : scrollTop.value[activeIndex.value])
})
watch(activeIndex, () => {
  set({ activeTab: activeIndex.value })
  router.replace({ name: activeTab.value })
})
watch(playData.value, () => {
  listVisible.value = playData.value.playlistVisible
  commitVisible.value = playData.value.commitVisible
})
watch(showVideoPlayer, () => {
  videoVisible.value = showVideoPlayer.value
})
watch(listVisible, () => {
  setPlayData({ playlistVisible: listVisible.value })
})
watch(commitVisible, () => {
  setPlayData({ commitVisible: commitVisible.value })
})
const onSwiper = (swiper) => {
  // 打印swiper对象
  swiperInstance.value = swiper
  let index = tabs.findIndex((el) => el.name == activeTab.value)
  activeIndex.value = index == -1 ? activeIndex.value : index
  // swiperInstance.value?.slideTo(activeIndex.value)
}
const onSlideChange = (value) => {
  if (value.activeIndex == activeIndex.value) return
  nextTick(() => {
    activeTab.value = tabs[value.activeIndex].name
    activeIndex.value = value.activeIndex
    set({ activeTab: activeIndex.value })
  })
}
const onTabClick = (tab) => {
  nextTick(() => {
    activeIndex.value = tabs.findIndex((el) => el.name == activeTab.value)
    swiperInstance.value?.slideTo(activeIndex.value)
  })
}
onMounted(() => {
  scrollbarRef.value && setScrollRef(scrollbarRef.value[activeIndex.value] || scrollbarRef.value)
  nextTick(() => {
    swiperInstance.value?.slideTo(activeIndex.value)
    scrollbarRef.value && setScrollRef(scrollbarRef.value[activeIndex.value] || scrollbarRef.value)
  })
})
router.afterEach(() => {
  activeTab.value = route.name
  let index = tabs.findIndex((el) => el.name == activeTab.value)
  activeIndex.value = index == -1 ? activeIndex.value : index
  swiperInstance.value?.slideTo(activeIndex.value)
  set({ activeTab: activeIndex.value })
})

const onReached = (val) => {
  if (val !== 'bottom') return
  set({ reachedEnd: true })
  setTimeout(() => {
    set({ reachedEnd: false })
  }, 500)
}
const onAction = (command, row) => {
  if (command == 'play') {
    setPlayData({ playIndex: playData.value.playlist?.findIndex((item) => item.id == row.id) })
    play(row)
    return
  }
  if (command == 'delete') {
    setPlayData({ playlist: playData.value.playlist.filter((item) => item.id !== row.id) })
    return
  }
}
</script>

<template>
  <el-container>
    <el-aside width="64px" class="!transition-all !duration-300 h-[100vh] z-999 hidden md:block shadow-[0_0_5px_0_rgba(0,0,0,0.1)]" :class="{ 'md:!shadow-[0_5px_30px_0_rgba(255,255,255,0.1)]': isDark, 'is-leave': player.showCover }">
      <Aside />
    </el-aside>
    <el-container class="overflow-hidden bg-[var(--el-bg-color)]">
      <el-header class="bg-[var(--el-bg-color)] !px-3 flex items-center shadow-[0_0_5px_0_rgba(0,0,0,0.1)]" :class="{ 'md:!shadow-[0_5px_30px_0_rgba(255,255,255,0.1)]': isDark }"><Header /></el-header>
      <swiper v-if="config.isMobile" :modules="modules" class="swipper w-full h-full" v-bind="{ ...swiperOptions, virtual: false, history: false, initialSlide: config.activeTab }" @swiper="onSwiper" @slideChange="onSlideChange">
        <swiper-slide class="swipper-item h-full" v-for="tab in tabs" :key="tab.name">
          <el-main class="bg-[transparent] md:!overflow-hidden !p-0 rounded layout">
            <el-scrollbar class="md:!h-[calc(100vh-120px)]" :style="scrollStyle" ref="scrollbarRef" :class="{ active: tab.name == activeTab }" @end-reached="onReached">
              <div class="scrollbar-wrapper !p-[10px] md:min-w-[700px] md:!pb-[10px]">
                <transition :name="'slide-fade'" v-show="tabsComponents[tab.name] && activeTab == tab.name">
                  <keep-alive :include="keepAliveRoutes">
                    <component :is="tabsComponents[tab.name]" />
                  </keep-alive>
                </transition>
                <router-view v-slot="{ Component }" v-show="!tabsComponents[route.name]">
                  <transition :name="'slide-fade'">
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
      <el-main class="bg-[transparent] md:!overflow-hidden !p-0 rounded layout" v-else>
        <el-scrollbar class="md:!h-[calc(100vh-120px)]" :style="scrollStyle" ref="scrollbarRef" @end-reached="onReached" @scroll="set({ reachedEnd: false })">
          <div class="scrollbar-wrapper !p-[10px] md:min-w-[700px] md:!pb-[10px]">
            <router-view v-slot="{ Component }">
              <transition :name="'slide-fade'">
                <keep-alive :include="keepAliveRoutes">
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-scrollbar>
      </el-main>
      <el-backtop :key="route.name" v-if="config.isMobile && swiperInstance && tabs?.find((el) => el.name == activeTab)" target=".layout .active .el-scrollbar__wrap" class="!z-999" :bottom="130" :right="15">
        <el-icon><Top /></el-icon>
      </el-backtop>
      <el-backtop :key="route.name" v-else target=".layout .el-scrollbar__wrap" class="!z-999" :bottom="130" :right="15">
        <el-icon><Top /></el-icon>
      </el-backtop>
      <el-footer
        @click.prevent
        v-show="config.showPlyerBar"
        class="bg-[var(--el-bg-color)] absolute md:static md:!flex bottom-[55px] md:bottom-0 w-full z-999 md:z-10001 !p-0 shadow-[0_-5px_30px_0_rgba(0,0,0,0.1)]"
        :class="{ 'md:!shadow-[0_-5px_30px_0_rgba(255,255,255,0.1)]': isDark, '!static': !config.showTab }"
      >
        <Footer />
      </el-footer>
      <el-tabs v-if="swiperInstance && config.showTab" :tab-position="'bottom'" @tab-click="onTabClick" v-model="activeTab" stretch class="bg-[var(--el-bg-color)] absolute tabs w-full md:!hidden z-1000 bottom-0 left-0 right-0 px-3 py-2 border-t border-[var(--el-border-color)]">
        <el-tab-pane :label="tab.meta.title" v-for="tab in tabs" :name="tab.name" :key="tab.name">
          <template #label>
            <div class="flex items-center flex-col">
              <el-icon :size="24"><component :is="tab.meta.icon" /></el-icon>
              <span class="text-xs">{{ tab.meta.title }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="transition-all duration-300" :class="{ 'translate-y-[30px]': player.showCover && config.isMobile }"></div>
    </el-container>
    <!-- 侧边栏 -->
    <el-drawer v-model="config.showAside" direction="ltr" modal-class="md:hidden backdrop-blur" size="30vw" :with-header="false" :z-index="99999" class="h-[100vh] md:hidden" body-class="!p-0">
      <Aside />
    </el-drawer>
    <!-- 播放器弹框 -->
    <el-drawer v-model="player.showCover" :z-index="9999" :modal-class="`!bg-[transparent]`" body-class="!p-0" header-class="text-center" direction="btt" :title="playData.title" size="100%" :with-header="false">
      <div class="relative z-10 backdrop-blur-2xl overflow-hidden">
        <div class="flex w-full items-center px-5 leading-[60px]">
          <div class="close cursor-pointer hover:text-[var(--el-color-primary)]" @click="setPlayer({ showCover: false })">
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
          <el-tooltip content="音乐视效" popper-class="!z-10002">
            <el-icon :size="32" v-if="!config.isMobile" @click="lyricAnimationVisible = true">
              <IconMusic class="cursor-pointer" />
            </el-icon>
          </el-tooltip>
        </div>
        <Cover />
        <Analyser />
      </div>
      <div class="bg-cover z-9 absolute top-0 overflow-hidden left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 blur-[100px] transition-all duration-300 ease-in-out" :style="{ backgroundImage: `url(${playData.img_url})` }"></div>
    </el-drawer>
    <!-- 播放列表弹框 -->
    <el-drawer v-model="listVisible" modal-class="backdrop-blur-sm" trigger="click" :z-index="10001" header-class="!leading-[32px] !p-3 !mb-0" :show-close="false" direction="btt" size="80%" body-class="!p-0" :show-arrow="false" :width="config.isMobile ? '95vw' : '680px'">
      <template #header>
        <span class="total">共{{ playData.playlist.length }}首歌曲</span>
        <el-button type="danger" :disabled="playData.playlist.length === 0" round @click="setPlayData({ playlist: [] })" icon="Delete">清空</el-button>
      </template>
      <Playlist :show-header="false" :data="{ info: playData, tracks: playData.playlist }" :tableProps="{ miniHeight: '200px', showHeader: false }">
        <template #table-action="{ row }">
          <div v-if="!config.isMobile">
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
              <el-icon :size="28">
                <IconPlay />
              </el-icon>
            </el-link>
            <el-link type="danger" :disabled="playData.playlist.length === 0" size="small" @click="setPlayData({ playlist: playData.playlist.filter((item) => item.id !== row.id) })">
              <el-icon :size="18">
                <Delete />
              </el-icon>
            </el-link>
          </div>
          <el-dropdown trigger="click" :show-arrow="false" popper-class="backdrop-blur !z-30000" @command="(command) => onAction(command, row)" v-else>
            <el-icon class="transform rotate-90"><MoreFilled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="play"
                  ><el-icon class="mr-2 !text-[var(--el-color-primary)]"><video-play /></el-icon>播放</el-dropdown-item
                >
                <el-dropdown-item command="delete"
                  ><el-icon class="mr-2 !text-[var(--el-color-danger)]"><Delete /></el-icon>移除</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </Playlist>
    </el-drawer>
    <!-- 歌词动效弹框 -->
    <el-drawer v-model="lyricAnimationVisible" :z-index="10002" size="100%">
      <LyricAnimation @close="lyricAnimationVisible = false" />
    </el-drawer>
    <!-- 歌曲评论弹框 -->
    <el-drawer :size="config.isMobile ? '100%' : '400px'" :z-index="10002" body-class="!p-0" header-class="!p-2 !mb-0" modal-class="backdrop-blur-sm" :show-close="false" append-to-body v-model="commitVisible" @close="commitVisible = false">
      <template #header="{ close }">
        <div class="flex items-center justify-between">
          <el-icon
            class="cursor-pointer"
            :size="24"
            @click="
              () => {
                close()
                commitVisible = false
              }
            "
          >
            <ArrowLeft />
          </el-icon>
          <div class="flex-1 flex flex-col text-center justify-center items-center">
            <span class="text-xl line-clamp-1 max-w-[50vw]">{{ playData.title }}</span>
            <span class="text-sm text-[var(--el-text-color-secondary)] text-nowrap">{{ playData.singer }}</span>
          </div>
        </div>
      </template>
      <Comment />
    </el-drawer>
    <!-- 视频播放弹框 -->
    <el-drawer
      v-model="videoVisible"
      :title="videoData.name + ' -- ' + videoData.artistName"
      header-class="!border-0 text-center !mb-5"
      destroy-on-close
      show-close
      direction="btt"
      :z-index="10002"
      size="100%"
      body-class="!p-0 !overflow-hidden"
      modal-class="backdrop-blur-sm"
      @close="setVideoPlayerShow(false)"
    >
      <videoDetail />
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
:deep(.el-tabs__nav-wrap:after) {
  height: 0;
}
</style>
