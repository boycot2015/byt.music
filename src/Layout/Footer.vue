<template>
  <footer class="footer w-full">
    <div class="nav flex items-center justify-between w-full relative z-999">
      <div class="left flex flex-1 cursor-pointer" @click="coverVisible = !coverVisible">
        <el-image :src="playData.img_url" fit="fill" class="w-10 h-10 mr-2" />
        <div class="info">
          <div class="title line-clamp-1">{{ playData.title }}</div>
          <div class="singer text-xs line-clamp-1">{{ playData.singer }}</div>
        </div>
      </div>
      <Player />
    </div>
    <el-drawer v-model="coverVisible" :z-index="10" modal-class="!absolute" body-class="!pb-0" header-class="text-center" direction="btt" :title="playData.title" size="100%" :with-header="true">
      <Cover />
    </el-drawer>
  </footer>
</template>
<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import Cover from '@/components/Cover/index.vue'
import Player from '@/components/Player/index.vue'
const playData = computed(() => usePlayerStore().playData)
const coverVisible = ref(false)
</script>
