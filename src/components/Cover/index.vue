<template>
  <div class="cover h-[calc(100vh-60px)] backdrop-blur-md">
    <div class="flex gap-10 items-center h-full justify-center mx-auto p-5">
      <div class="cover-img">
        <Image class="w-[300px] rounded" :src="playData.img_url">
          <template #placeholder>
            <el-icon :size="320" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
          <template #error>
            <el-icon :size="320" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
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
