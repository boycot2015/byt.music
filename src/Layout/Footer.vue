<template>
  <footer class="footer w-full">
    <div class="nav flex items-center justify-between w-full relative z-10000">
      <div class="left flex flex-1 cursor-pointer" @click="coverVisible = !coverVisible">
        <Image :src="playData.img_url" fit="fill" class="w-11 h-11 mr-2 rounded">
          <template #placeholder>
            <el-icon :size="44" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
          <template #error>
            <el-icon :size="44" class="h-10 !text-[var(--el-menu-text-color)]"><IconMusic /></el-icon>
          </template>
        </Image>
        <div class="info">
          <div class="title line-clamp-1">{{ playData.title }}</div>
          <div class="singer text-xs line-clamp-1">{{ playData.singer }}</div>
        </div>
      </div>
      <Player />
    </div>
    <el-drawer v-model="coverVisible" :z-index="9999" :modal-class="`!absolute !bg-[transparent]`" body-class="!p-0" header-class="text-center" direction="btt" :title="playData.title" size="100%" :with-header="false">
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
      </div>
      <div class="bg-cover z-9 absolute top-0 overflow-hidden left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 blur-[10px] transition-all duration-300 ease-in-out" :style="{ backgroundImage: `url(${playData.img_url})` }"></div>
    </el-drawer>
  </footer>
</template>
<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import Cover from '@/components/Cover/index.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import Player from '@/components/Player/index.vue'
const playData = computed(() => usePlayerStore().playData)
const coverVisible = ref(false)
</script>
