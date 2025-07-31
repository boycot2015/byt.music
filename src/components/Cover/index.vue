<template>
  <div class="cover h-[calc(100vh-60px)] backdrop-blur-md">
    <div class="flex gap-10 md:items-center md:h-full overflow-hidden md:justify-center !mt-0 m-3 md:m-5">
      <div class="cover-img hidden lg:block">
        <Image class="w-[300px] rounded" :src="playData.img_url">
          <template #placeholder>
            <el-icon :size="300" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
          <template #error>
            <el-icon :size="300" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
        </Image>
      </div>
      <div class="lyric flex items-center">
        <Lyric />
      </div>
    </div>
  </div>
</template>
<script setup>
// import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import Lyric from './Lyric.vue'
const playerStore = usePlayerStore()
const { playData } = playerStore
</script>
