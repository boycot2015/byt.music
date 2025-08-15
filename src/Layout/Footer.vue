<template>
  <div class="footer w-full">
    <div class="transition-all duration-300">
      <div class="absolute bottom-[60px] w-full flex md:z-9999">
        <Slider
          class="!w-full md:z-99 !h-[auto] text-center"
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
        <div class="left flex flex-1 cursor-pointer" @click="setPlayer({ showCover: !player.showCover })">
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
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import NProgress from 'nprogress'
import Playlist from '@/views/components/Playlist.vue'
const inputValue = ref(0)
const playData = computed(() => usePlayerStore().playData)
const player = computed(() => usePlayerStore().player)
const config = computed(() => useConfigStore().config)
const { setPlayer, play, setPlayData } = usePlayerStore()
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