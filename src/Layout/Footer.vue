<template>
  <footer class="footer w-full">
    <div class="absolute bottom-[60px] w-full flex md:z-9999">
      <el-button size="large" loading v-if="player.loading && player.playBar == 'full'" type="primary" link loading-icon="Loading" class="z-9999 !absolute left-0 top-[-8px]"></el-button>
      <Slider
        class="!w-full md:z-999 !h-[auto] text-center"
        v-show="player.playBar == 'full' || config.isMobile"
        @change="
          (value) => {
            setPlayer({
              withLyric: true,
              currentTime: value,
            })
          }
        "
      />
    </div>
    <div class="nav flex items-center justify-between w-full relative md:z-100 px-3">
      <div class="left flex flex-1 cursor-pointer" @click="coverVisible = !coverVisible">
        <Image :src="playData.img_url" fit="fill" class="w-10 h-10 mr-2 rounded">
          <template #placeholder>
            <el-icon :size="44" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
          <template #error>
            <el-icon :size="44" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
        </Image>
        <div class="info flex-1">
          <div v-if="player.loading" class="leading-[42px] line-clamp-1">正在加载资源...</div>
          <template v-else>
            <div class="title line-clamp-1">{{ playData.title }}</div>
            <div class="singer text-xs line-clamp-1">{{ playData.singer }}</div>
          </template>
        </div>
      </div>
      <Player />
    </div>
    <el-drawer v-model="coverVisible" :z-index="99" :modal-class="`!absolute !bg-[transparent]`" body-class="!p-0" header-class="text-center" direction="btt" :title="playData.title" size="100%" :with-header="false">
      <div class="relative z-10 backdrop-blur-2xl overflow-hidden">
        <div class="flex w-full items-center px-5 leading-[60px]">
          <div class="close cursor-pointer md:order-2 hover:text-[var(--el-color-primary)]" @click="coverVisible = false">
            <el-icon :size="24">
              <ArrowDown />
            </el-icon>
          </div>
          <div class="flex flex-col md:flex-row flex-1 items-center text-center justify-center">
            <div class="title text-xl line-clamp-1 md:mr-2">{{ playData.title }}<span class="hidden md:inline"> --</span></div>
            <span class="text-xs md:text-xl">{{ playData.singer }}</span>
          </div>
          <el-icon :size="32" v-if="config.isMobile" @click="playlistVisible = true">
            <IconListMusic class="cursor-pointer" />
          </el-icon>
          <el-drawer trigger="click" :z-index="99" header-class="!leading-[32px] !px-3 !mb-2" :show-close="false" direction="btt" size="80%" body-class="!p-0" v-model="playlistVisible" :show-arrow="false" :width="config.isMobile ? '95vw' : '680px'">
            <template #header>
              <span class="total">共{{ playData.playlist.length }}首歌曲</span>
              <el-button type="danger" :disabled="playData.playlist.length === 0" round @click="setPlayData({ playlist: [] })" icon="Delete">清空</el-button>
            </template>
            <Playlist :show-header="false" :data="{ info: playData, tracks: playData.playlist }" :tableProps="{ miniHeight: '200px', showHeader: false }">
              <template #table-action="{ row }">
                <el-link type="danger" :disabled="playData.playlist.length === 0" size="small" @click="setPlayData({ playlist: playData.playlist.filter((item) => item.id !== row.id) })" icon="Delete"></el-link>
              </template>
            </Playlist>
          </el-drawer>
        </div>
        <Cover />
        <Analyser />
      </div>
      <div class="bg-cover z-9 absolute top-0 overflow-hidden left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 blur-[100px] transition-all duration-300 ease-in-out" :style="{ backgroundImage: `url(${playData.img_url})` }"></div>
    </el-drawer>
  </footer>
</template>
<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import Cover from '@/components/Cover/index.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import Player from '@/components/Player/index.vue'
import Slider from '@/components/Player/components/Slider.vue'
import Analyser from '@/components/Player/components/Analyser/index.vue'
import NProgress from 'nprogress'
import Playlist from '@/views/components/Playlist.vue'
const inputValue = ref(0)
const playlistVisible = ref(false)
const playData = computed(() => usePlayerStore().playData)
const player = computed(() => usePlayerStore().player)
const config = computed(() => useConfigStore().config)
const { setPlayer } = usePlayerStore()
const coverVisible = ref(player.value.showCover)
watch(coverVisible, (value) => {
  setPlayer({ showCover: value })
})
</script>
<style lang="scss" scoped>
:deep(.el-slider) {
  .el-slider__bar,
  .el-slider__runway {
    height: 5px;
  }
  .el-slider__button-wrapper {
    display: none;
  }
}
</style>