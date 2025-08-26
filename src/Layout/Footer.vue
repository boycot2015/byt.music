<template>
  <div class="footer w-full">
    <div class="transition-all duration-300">
      <div class="absolute bottom-[60px] w-full flex md:z-9999">
        <Slider
          class="!w-full md:z-99 !h-[auto] text-center"
          v-show="player.playBar == 'full' && !config.isMobile"
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
      <div class="nav flex items-center justify-between h-full w-full relative md:z-100 px-1.5">
        <div class="left items-center flex flex-1 cursor-pointer" @click="setPlayer({ showCover: !player.showCover })">
          <Image :src="playData.img_url" fit="fill" class="w-[46px] h-[46px] mr-2 rounded">
            <template #placeholder>
              <el-icon :size="48" class="h-[46px] !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
            </template>
            <template #error>
              <el-icon :size="48" class="h-[46px] !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
            </template>
          </Image>
          <div class="info flex-1 relative flex flex-col justify-center">
            <div v-if="player.loading" class="leading-[42px] line-clamp-1">正在加载资源...</div>
            <template v-else>
              <div class="title line-clamp-1">{{ playData.title }}</div>
              <Slider
                class="!w-full md:z-99 !absolute is-inner text-center top-[33px]"
                v-if="config.isMobile"
                @change="
                  (value) => {
                    setPlayer({
                      withLyric: true,
                      currentTime: value,
                    })
                  }
                "
              />
              <div class="singer !text-md line-clamp-1 hidden md:block">{{ playData.singer }}</div>
              <el-carousel v-if="config.isMobile" :initial-index="playData.lyricIndex" indicator-position="none" ref="sliderRef" height="20px" class="flex-1 md:!hidden" direction="vertical" :autoplay="false">
                <el-carousel-item v-for="(item, index) in playData.lyricList" :key="item">
                  <TextSlider v-show="playData.lyricIndex == index" :duration="playData.lyricList[index + 1] ? (playData.lyricList[index + 1].split(']')[0].split(':')[1] - item.split(']')[0].split(':')[1]) * 1000 : 1000" :msg="item.split(']')[1]" :max="6" />
                  <span v-show="playData.lyricIndex != index">{{ item.split(']')[1] }}</span>
                </el-carousel-item>
              </el-carousel>
            </template>
          </div>
        </div>
        <Player />
      </div>
    </div>
  </div>
</template>
<script setup>
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import NProgress from 'nprogress'
import Playlist from '@/views/components/Playlist.vue'
const inputValue = ref(0)
const sliderRef = ref(null)
const playData = computed(() => usePlayerStore().playData)
const player = computed(() => usePlayerStore().player)
const config = computed(() => useConfigStore().config)
const { setPlayer, play, setPlayData } = usePlayerStore()
watch(playData.value, () => {
  sliderRef.value?.setActiveItem(playData.value.lyricIndex)
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
:deep(.is-inner .el-slider) {
  .el-slider__bar,
  .el-slider__runway {
    height: 20px;
  }
  .el-slider__button-wrapper {
    display: none;
  }
}
</style>