<template>
  <div class="player leading-[60px] h-[60px] flex flex-1 md:flex-3 items-center justify-around w-full">
    <el-carousel :initial-index="playData.lyricIndex" indicator-position="none" :cardScale="0.75" ref="sliderRef" height="60px" v-if="!config.isMobile && !player.showCover" class="flex-1" direction="vertical" type="card" :autoplay="false">
      <el-carousel-item v-for="(item, index) in lyricList" :key="item">
        <h3 class="text-[14px] text-center leading-[30px]" :class="{ 'bg-linear-to-r bg-clip-text from-[var(--el-text-color-regular)] text-transparent to-[var(--el-color-primary)]': index === playData.lyricIndex }">{{ item.split(']')[1] }}</h3>
      </el-carousel-item>
    </el-carousel>
    <div class="md:flex-3 !hidden md:!flex mx-2" :class="{ 'justify-end md:flex-1': player.playBar == 'small' }" v-if="player.playBar != 'full'">
      <div class="flex flex-col items-center justify-center" :class="{ '!flex-row w-full': player.playBar == 'middle' }">
        <span class="leading-[26px] w-10 mr-4" v-show="!player.loading" :class="{ '!order-2 ml-2': player.playBar == 'middle' }">{{ formatTime(player.currentTime) }}/{{ formatTime(player.duration) }}</span>
        <div class="flex w-full">
          <Slider @change="onSliderChange" />
        </div>
      </div>
    </div>
    <div class="controls flex items-center justify-end flex-1 ml-5">
      <el-icon :size="22" class="!hidden md:!block mr-2" title="音频可视化" @click="setPlayer({ visualizer: !player.visualizer })">
        <IconAnalyser class="cursor-pointer" :class="{ 'opacity-50': !player.visualizer }" />
      </el-icon>
      <el-icon class="cursor-pointer mr-2" :size="26" @click="() => toggleCollect({ ...playData }, 'song')">
        <IconHeartFill class="text-[var(--el-color-primary)]" v-if="has(playData.id, 'song')" />
        <IconHeart v-else />
      </el-icon>
      <div class="mr-3 hidden md:flex items-center">
        <el-icon :size="30" :disabled="disabled">
          <IconInfinity class="cursor-pointer" @click="setPlayer({ loop: false, random: false })" v-if="player.random" />
          <IconLoop class="cursor-pointer" @click="setPlayer({ loop: !player.loop, random: true })" v-else-if="player.loop" />
          <IconListPlay class="cursor-pointer" @click="setPlayer({ loop: !player.loop, random: false })" v-else />
        </el-icon>
      </div>
      <div class="mr-3 hidden md:flex items-center">
        <el-icon :size="30" @click="setPlayer({ muted: !player.muted })" :disabled="disabled">
          <el-popover trigger="hover" popper-class="backdrop-blur" :show-arrow="false">
            <template #reference>
              <IconVolume class="cursor-pointer" v-if="!player.muted" />
              <IconVolumeOff class="cursor-pointer" v-else />
            </template>
            <el-slider :step="0.1" size="small" class="!h-[auto] text-center w-full" v-model="player.volume" :min="0" :format-tooltip="() => formatTime(player.volume, 'percent')" :max="1" @input="(val) => (inputValue = val)" @change="(val) => onSliderChange(val, 'volume')" />
          </el-popover>
        </el-icon>
      </div>
      <el-icon class="!hidden md:!block" :size="38" @click="playPrev">
        <IconPrev class="cursor-pointer" />
      </el-icon>
      <el-icon :size="38" @click="togglePlay" :disabled="disabled">
        <IconPlay class="cursor-pointer" v-if="paused" />
        <IconPause class="cursor-pointer" v-else />
      </el-icon>
      <el-icon :size="38" @click="playNext">
        <IconNext class="cursor-pointer" />
      </el-icon>
      <el-icon :size="32" class="!block md:!hidden" @click="setPlayData({ playlistVisible: true })">
        <IconListMusic class="cursor-pointer" />
      </el-icon>
      <el-popover trigger="click" :show-arrow="false" popper-class="backdrop-blur !z-10001" :width="config.isMobile ? '95vw' : '680px'">
        <template #reference>
          <el-icon :size="32" class="!hidden md:!block">
            <IconListMusic class="cursor-pointer" />
          </el-icon>
        </template>
        <template #default>
          <Playlist :show-header="false" header-class="!flex-row" :data="{ info: playData, tracks: playData.playlist }" :tableProps="{ maxHeight: '400px', miniHeight: '200px', showHeader: false }">
            <template #action>
              <span class="total">共{{ playData.playlist.length }}首歌曲</span>
              <el-button type="danger" :disabled="playData.playlist.length === 0" size="small" @click="setPlayData({ playlist: [] })" icon="Delete">清空</el-button>
            </template>
            <template #table-action="{ row }">
              <el-link type="danger" :disabled="playData.playlist.length === 0" size="small" @click="setPlayData({ playlist: playData.playlist.filter((item) => item.id !== row.id) })" icon="Delete"></el-link>
            </template>
          </Playlist>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script name="Player" setup>
import { computed, ref, nextTick, onMounted, watch } from 'vue'
import { formatTime } from '@/utils'
import { usePlayerStore } from '@/stores/player'
import { useCollectStore } from '@/stores/collect'
import { useConfigStore } from '@/stores/config'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconNext from '@/components/icons/IconNext.vue'
import IconPrev from '@/components/icons/IconPrev.vue'
import IconInfinity from '@/components/icons/IconInfinity.vue'
import IconLoop from '@/components/icons/IconLoop.vue'
import IconListPlay from '@/components/icons/IconListPlay.vue'
import IconListMusic from '@/components/icons/IconListMusic.vue'
import IconVolume from '@/components/icons/IconVolume.vue'
import IconVolumeOff from '@/components/icons/IconVolumeOff.vue'
import Playlist from '@/views/components/Playlist.vue'
import Slider from './components/Slider.vue'

const playerStore = usePlayerStore()
const configStore = useConfigStore()
const collectStore = useCollectStore()
const { audioRef, initPlay, play, setPlayData, playNext, playPrev, togglePlay, setPlayer } = playerStore
const { has, toggleCollect } = collectStore
const player = computed(() => usePlayerStore().player)
const playData = computed(() => usePlayerStore().playData)
const { config } = configStore
const paused = computed(() => player.value.paused)
const muted = computed(() => player.value.muted)
const url = computed(() => playData.value.url)
const lyricList = computed(() => playData.value.lyricList)
const sliderRef = ref(null)
const inputValue = ref(0)
const disabled = computed(() => !playData.value.url || player.value.loading)
const playlistVisible = ref(false)

const onSliderChange = (val, prop = 'currentTime') => {
  setPlayer({
    withLyric: true,
    [prop]: val,
    muted: prop == 'volume' && val === 0,
  })
}
onMounted(() => {})
watch(playData.value, () => {
  sliderRef.value?.setActiveItem(playData.value.lyricIndex)
})
defineExpose({
  togglePlay,
  playNext,
  playPrev,
  setPlayer: (...args) => onSliderChange(...args),
})
</script>
<style lang="scss" scoped>
.player :deep(.el-slider) {
  .el-slider__bar,
  .el-slider__runway {
    height: var(--el-slider-height);
    // top: -7px;
  }
  .el-slider__button-wrapper {
    display: block;
    // height: 20px;
  }
}
</style>