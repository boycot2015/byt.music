<template>
  <div class="favorites h-full !p-0">
    <el-row>
      <el-col :span="6">
        <el-scrollbar style="height: calc(100vh - 210px)">
          <el-menu :default-active="current" :key="current" class="h-[calc(100vh-210px)]" @select="onSelect" v-if="collect[current]">
            <el-menu-item v-for="(item, index) in collect" :key="item.info?.id || index" :index="index + ''" @mouseenter="collectStore.update({ ...item, showClose: true })" @mouseleave="collectStore.update({ ...item, showClose: false })">
              <div class="flex items-center pl-[-20px]">
                <el-image class="basis-[36px]" :src="item.info.cover_img_url"></el-image>
                <div class="text-xs flex-1 ml-2 line-clamp-2 text-wrap pr-[10px]">{{ item.info.title }}</div>
                <div class="close cursor-pointer hover:text-[var(--vt-c-primary)] absolute right-0 transition-colors duration-300 ease-in-out" :class="{ hidden: !item.showClose }">
                  <el-icon @click="collectStore.remove(item.info.id)"><Delete /></el-icon>
                </div>
              </div>
            </el-menu-item>
          </el-menu>
          <el-empty v-else></el-empty>
        </el-scrollbar>
        <div class="flex justify-center border-t border-[#e4e4e4] py-2">
          <el-button :disabled="!collect.length" type="danger" @click="collectStore.update([])" class="flex">
            <el-icon class="mr-2"><Delete /></el-icon> 清空
          </el-button>
        </div>
      </el-col>
      <el-col :span="18">
        <Playlist ref="playlistRef" v-loading="loading" :data="collect[current]" :tableProps="{ maxHeight: 'calc(100vh - 160px)' }">
          <template #action>
            <div class="actions text-right fixed top-4 right-2" v-if="showActions">
              <el-button type="primary" :disabled="!collect[current]" @click="handlePlayAll"
                ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
              >
              <el-link :href="collect[current]?.info?.source_url" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3">
                <el-button :disabled="!collect[current]"
                  ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
                >
              </el-link>
            </div>
          </template>
        </Playlist>
      </el-col>
    </el-row>
  </div>
</template>
<script name="favorites" setup>
import { computed, onMounted, ref } from 'vue'
import { useCollectStore } from '@/stores/collect'
import { VideoPlay, Link, Delete } from '@element-plus/icons-vue'
import { usePlayerStore } from '@/stores/player'
import { ElMessageBox } from 'element-plus'
import Playlist from '@/views/components/Playlist.vue'
const playerStore = usePlayerStore()
const { play, setPlayData } = playerStore
const collectStore = useCollectStore()
const collect = computed(() => collectStore.collect)
const current = computed(() => collectStore.current)
const playlistRef = ref(null)
const showActions = ref(false)
const loading = ref(false)
const handlePlayAll = () => {
  ElMessageBox.confirm('此操作会替换播放列表，是否播放？')
    .then(() => {
      playlistRef.value?.setScrollTop(0)
      setPlayData({ playIndex: 0, playlist: collect.value[current.value].tracks, paused: false, currentTime: 0 })
      play(collect.value[current.value].tracks[0])
    })
    .catch((err) => {
      console.log(err)
    })
}
const onSelect = (index) => {
  loading.value = true
  playlistRef.value?.setScrollTop(0)
  collectStore.setCurrent(index)
  setTimeout(() => {
    loading.value = false
  }, 200)
}
onMounted(() => {
  setTimeout(() => {
    showActions.value = true
  }, 100)
})
</script>
<style></style>
