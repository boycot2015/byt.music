<template>
  <div class="favorites h-full !p-0 min-h-[300px]">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-scrollbar style="height: calc(100vh - 160px)" class="ml-[-20px] border-r border-[var(--el-menu-border-color)]">
          <el-menu :default-active="current" class="h-[calc(100vh-210px)] !border-0" @select="onSelect" v-if="collect[current]">
            <el-menu-item v-for="(item, index) in collect" :key="item.info?.id || index" :index="index + ''" @mouseenter="collectStore.update({ ...item, showClose: true })" @mouseleave="collectStore.update({ ...item, showClose: false })">
              <div class="flex items-center">
                <Image class="basis-[36px] rounded" :src="item.info.cover_img_url"></Image>
                <div class="flex-1 ml-2">
                  <div class="text-xs line-clamp-2 text-wrap pr-[10px]" v-html="item.info.title"></div>
                </div>
                <div class="close cursor-pointer hover:text-[var(--el-color-primary)] absolute right-2 transition-colors duration-300 ease-in-out" :class="{ hidden: !item.showClose }">
                  <el-icon @click="collectStore.remove(item.info.id)"><Delete /></el-icon>
                </div>
              </div>
            </el-menu-item>
          </el-menu>
          <Empty v-else></Empty>
        </el-scrollbar>
      </el-col>
      <el-col :span="18">
        <Playlist ref="playlistRef" class="rounded-md" v-loading="loading" :data="{ ...collect[current], tracks: playlist }" :tableProps="{ maxHeight: 'calc(100vh - 210px)' }">
          <template #action>
            <div class="flex justify-between items-center mb-[10px]" v-if="collect[current]?.info">
              <div class="text-right">
                <el-button type="primary" :disabled="!collect[current]" @click="() => playlistRef.handlePlayAll()"
                  ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
                >
                <el-link :href="collect[current]?.info?.source_url" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3">
                  <el-button :disabled="!collect[current]"
                    ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
                  >
                </el-link>
              </div>
            </div>
          </template>
        </Playlist>
      </el-col>
    </el-row>
  </div>
</template>
<script name="favorites" setup>
import { computed, ref, getCurrentInstance, onActivated } from 'vue'
import { useCollectStore } from '@/stores/collect'
import { VideoPlay, Link, Delete } from '@element-plus/icons-vue'
import Playlist from '@/views/components/Playlist.vue'

const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const collectStore = useCollectStore()
const collect = computed(() => collectStore.collect)
const current = computed(() => collectStore.current)
const playlistRef = ref(null)
const playlist = ref([])
const loading = ref(false)
const onSelect = (index) => {
  loading.value = true
  playlistRef.value?.setScrollTop(0)
  collectStore.setCurrent(index)
  fetchData()
}
const fetchData = async () => {
  if (!collect.value[current.value]) return
  loading.value = true
  const response = await fetch(`${$apiUrl}/music/detail?type=${collect.value[current.value].type}&id=${collect.value[current.value]?.id}`)
  let res = await response.json()
  loading.value = false
  playlist.value = res.data.tracks || []
}
fetchData()
onActivated(() => {
  fetchData()
})
</script>
<style></style>
