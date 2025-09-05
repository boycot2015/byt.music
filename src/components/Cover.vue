<template>
  <div class="cover h-[calc(100vh-60px)] backdrop-blur-md relative z-2">
    <div class="hidden md:!flex relative z-2 gap-10 md:items-center md:h-full overflow-hidden md:justify-center !mt-0 m-3 md:m-5">
      <div class="cover-img hidden md:block">
        <Image class="w-[300px] rounded" :src="playData.img_url">
          <template #placeholder>
            <el-icon :size="300" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
          <template #error>
            <el-icon :size="300" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
        </Image>
        <div class="title line-clamp-1 hidden md:block" v-if="playData.title">歌曲：{{ playData.title }}</div>
        <div class="singer !text-md line-clamp-1 hidden md:block" v-if="playData.singer">歌手：{{ playData.singer }}</div>
      </div>
      <Lyric />
    </div>
    <swiper class="md:!hidden h-[68vh]" :modules="modules" :space-between="0" @swiper="onSwiper" @slideChange="onSlideChange">
      <swiper-slide>
        <div class="flex cover-img justify-center h-full items-center">
          <Image class="w-[300px] rounded" :src="playData.img_url">
            <template #placeholder>
              <el-icon :size="300" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
            </template>
            <template #error>
              <el-icon :size="300" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
            </template>
          </Image></div
      ></swiper-slide>
      <swiper-slide><Lyric class="w-full" /></swiper-slide>
    </swiper>
    <div class="bottom h-[20vh] mt-2 flex flex-col items-center justify-between md:!hidden">
      <div class="slider w-full px-5 relative">
        <Slider class="!w-full" :disabled="player.loading" @change="(val) => setPlayer({ withLyric: true, currentTime: val })" />
        <div class="flex items-center justify-between mt-2">
          <div class="text-[12px]">{{ formatTime(player.currentTime) }}</div>
          <div class="text-[12px]">{{ formatTime(player.duration) }}</div>
        </div>
      </div>
      <div class="controls flex items-center justify-between px-10 w-full">
        <el-icon :size="46" @click="playPrev">
          <IconPrev class="cursor-pointer" />
        </el-icon>
        <el-icon :size="46" @click="togglePlay" :disabled="disabled">
          <IconPlay class="cursor-pointer" v-if="paused" />
          <IconPause class="cursor-pointer" v-else />
        </el-icon>
        <el-icon :size="46" @click="playNext">
          <IconNext class="cursor-pointer" />
        </el-icon>
      </div>
      <div class="actions flex items-center justify-between px-5 w-full">
        <el-icon :size="22" @click="setPlayer({ visualizer: !player.visualizer })">
          <IconAnalyser class="cursor-pointer" :class="{ 'opacity-50': !player.visualizer }" />
        </el-icon>
        <el-icon class="cursor-pointer mr-2" :size="22" @click="() => toggleCollect({ ...playData }, 'song')">
          <IconHeartFill class="text-[var(--el-color-primary)]" v-if="has(playData.id, 'song')" />
          <IconHeart v-else />
        </el-icon>
        <div class="flex items-center">
          <el-icon :size="24" :disabled="disabled">
            <IconInfinity class="cursor-pointer" @click="setPlayer({ loop: false, random: false })" v-if="player.random" />
            <IconLoop class="cursor-pointer" @click="setPlayer({ loop: !player.loop, random: true })" v-else-if="player.loop" />
            <IconListPlay class="cursor-pointer" @click="setPlayer({ loop: !player.loop, random: false })" v-else />
          </el-icon>
        </div>
        <div class="flex items-center">
          <el-icon :size="24" :disabled="disabled">
            <el-popover trigger="click" popper-class="backdrop-blur !z-10002" :show-arrow="false">
              <template #reference>
                <IconVolume class="cursor-pointer" v-if="!player.muted" />
                <IconVolumeOff class="cursor-pointer" v-else />
              </template>
              <div class="flex">
                <IconVolume @click="setPlayer({ muted: !player.muted })" class="cursor-pointer mr-2" v-if="!player.muted" />
                <IconVolumeOff @click="setPlayer({ muted: !player.muted })" class="cursor-pointer mr-2" v-else />
                <el-slider
                  :step="0.1"
                  size="small"
                  class="!h-[auto] text-center w-full"
                  v-model="player.volume"
                  :min="0"
                  :format-tooltip="() => formatTime(player.volume, 'percent')"
                  :max="1"
                  @input="(val) => (inputValue = val)"
                  @change="
                    (val) =>
                      setPlayer({
                        volume: val,
                      })
                  "
                />
              </div>
            </el-popover>
          </el-icon>
        </div>
        <div class="flex items-center" @click="setPlayData({ commitVisible: true })">
          <el-icon :size="22" :disabled="disabled"> <ChatDotSquare class="cursor-pointer" @click="setPlayer({ loop: false, random: false })" /> </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { usePlayerStore } from '@/stores/player'
import { useCollectStore } from '@/stores/collect'
import { useConfigStore } from '@/stores/config'
import { formatTime } from '@/utils'
import { useSwiper } from '@/hooks/useSwiper'
const { Swiper, SwiperSlide, modules, swiperOptions } = useSwiper()

const playerStore = usePlayerStore()
const configStore = useConfigStore()
const collectStore = useCollectStore()
const { initPlay, play, setPlayData, setPlayer } = playerStore
const { has, toggleCollect } = collectStore
const { playNext, playPrev, togglePlay } = playerStore
const { config } = configStore
const lyricVisible = ref(false)
const commitVisible = ref(false)
const player = computed(() => playerStore.player)
const paused = computed(() => player.value.paused)
const muted = computed(() => player.value.muted)
const playData = computed(() => playerStore.playData)
const disabled = computed(() => !playData.value.url || player.value.loading)
const onSwiper = (swiper) => {
  // console.log(swiper)
}
const onSlideChange = () => {
  // console.log('slide change')
}
</script>
