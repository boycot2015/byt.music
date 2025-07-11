<template>
  <div class="cover h-[calc(100vh-60px)] backdrop-blur-md">
    <div class="flex gap-10 items-center h-full justify-center mx-auto p-5">
      <div class="cover-img w-[500px]">
        <el-image class="min-w-[200px]" :src="playData.img_url || '/logo.svg'"></el-image>
      </div>
      <div class="lyric">
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
