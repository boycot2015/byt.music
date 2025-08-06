<template>
  <footer class="footer w-full transition-width duration-300">
    <div class="absolute bottom-[60px] w-full flex z-9999">
      <el-button size="large" loading v-if="player.loading && player.playBar == 'full'" type="primary" link loading-icon="Loading" class="z-9999 !absolute left-0 top-[-8px]"></el-button>
      <Slider
        class="!w-full z-999 !h-[auto] text-center"
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
    <div class="nav flex items-center justify-between w-full relative z-100 px-3">
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
          <div v-if="player.loading" class="leading-[42px]">正在加载资源...</div>
          <template v-else>
            <div class="title line-clamp-1">{{ playData.title }}</div>
            <div class="singer text-xs line-clamp-1">{{ playData.singer }}</div>
          </template>
        </div>
      </div>
      <Player ref="playerRef" />
    </div>
    <el-drawer v-model="coverVisible" :z-index="99" :modal-class="`!absolute !bg-[transparent]`" body-class="!p-0" header-class="text-center" direction="btt" :title="playData.title" size="100%" :with-header="false">
      <div class="relative z-10 backdrop-blur-2xl overflow-hidden">
        <div class="flex w-full items-center px-10 pr-5 leading-[60px]">
          <div class="flex flex-1 items-center text-center justify-center">
            <div class="title text-xl line-clamp-1 mr-2">{{ playData.title }}--{{ playData.singer }}</div>
          </div>
          <div class="close cursor-pointer hover:text-[var(--el-color-primary)]" @click="coverVisible = false">
            <el-icon :size="24">
              <ArrowDown />
            </el-icon>
          </div>
        </div>
        <Cover />
        <Analyser v-if="player.visualizer" />
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

const inputValue = ref(0)
const playData = computed(() => usePlayerStore().playData)
const player = computed(() => usePlayerStore().player)
const config = computed(() => useConfigStore().config)
const { setPlayer } = usePlayerStore()
const coverVisible = ref(player.value.showCover)
const playerRef = ref(null)
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