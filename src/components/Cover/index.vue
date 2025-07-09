<template>
  <div class="cover h-full">
    <div class="flex gap-10 items-center h-full justify-center mx-auto">
      <div class="cover-img">
        <el-image :src="playData.img_url"></el-image>
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
