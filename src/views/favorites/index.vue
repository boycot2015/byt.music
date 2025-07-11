<template>
  <div class="favorites h-full !p-0 min-h-[300px]">
    <el-row>
      <el-col :span="6">
        <el-scrollbar style="height: calc(100vh - 210px)">
          <el-menu :default-active="current" :key="current" class="h-[calc(100vh-210px)]" @select="onSelect" v-if="collect[current]">
            <el-menu-item v-for="(item, index) in collect" :key="item.info?.id || index" :index="index + ''" @mouseenter="collectStore.update({ ...item, showClose: true })" @mouseleave="collectStore.update({ ...item, showClose: false })">
              <div class="flex items-center">
                <el-image class="basis-[36px] rounded" :src="item.info.cover_img_url"></el-image>
                <div class="flex-1 ml-2">
                  <div class="text-xs line-clamp-2 text-wrap pr-[10px]" v-html="item.info.title"></div>
                </div>
                <div class="close cursor-pointer hover:text-[var(--vt-c-primary)] absolute right-0 transition-colors duration-300 ease-in-out" :class="{ hidden: !item.showClose }">
                  <el-icon @click="collectStore.remove(item.info.id)"><Delete /></el-icon>
                </div>
              </div>
            </el-menu-item>
          </el-menu>
          <el-empty v-else></el-empty>
        </el-scrollbar>
        <div class="flex justify-center border-t border-r border-[var(--el-menu-border-color)] py-2">
          <el-button
            :disabled="!collect.length"
            type="danger"
            @click="
              () => {
                collectStore.update([])
                loading = false
                playlist = []
              }
            "
            class="flex"
          >
            <el-icon class="mr-2"><Delete /></el-icon> 清空
          </el-button>
        </div>
      </el-col>
      <el-col :span="18" v-loading="loading">
        <div class="flex justify-between items-center mb-[10px] pl-3" v-if="collect[current]?.info">
          <div class="flex flex-1 items-center">
            <div class="text-xs flex items-center">
              <el-avatar class="mr-2" size="small" v-if="collect[current]?.info?.headurl" :src="collect[current]?.info?.headurl"></el-avatar>
              <el-icon class="mr-2" v-else><User /></el-icon>
              <span class="line-clamp-1">{{ collect[current]?.info?.nickname || collect[current]?.info?.title }}</span>
            </div>
            <el-divider direction="vertical" />
            <div class="text-xs line-clamp-1">{{ new Date(collect[current]?.info?.ctime).toLocaleString().split(' ')[0].replace(/\//g, '-') }}</div>
            <el-divider direction="vertical" />
            <div class="text-xs line-clamp-1">
              {{ collect[current]?.info.play_count ? (collect[current]?.info.play_count > 10000 ? (collect[current]?.info.play_count / 10000).toFixed(1) + '万次播放' : collect[current]?.info.play_count + '次播放') : '' }}
            </div>
            <el-divider direction="vertical" />
            <div class="text-xs line-clamp-1">
              <span class="text-[var(--vt-c-primary)]">{{ collect[current]?.info?.total_song_num }}</span
              >首歌曲
            </div>
          </div>
          <div class="text-right">
            <el-button type="primary" :disabled="!collect[current]" @click="handlePlayAll"
              ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
            >
            <el-link :href="collect[current]?.info?.source_url" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3">
              <el-button :disabled="!collect[current]"
                ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
              >
            </el-link>
          </div>
        </div>
        <Playlist ref="playlistRef" :data="{ ...collect[current], tracks: playlist }" :tableProps="{ maxHeight: 'calc(100vh - 210px)' }"> </Playlist>
      </el-col>
    </el-row>
  </div>
</template>
<script name="favorites" setup>
import { computed, ref, getCurrentInstance } from 'vue'
import { useCollectStore } from '@/stores/collect'
import { VideoPlay, Link, Delete, User } from '@element-plus/icons-vue'
import { usePlayerStore } from '@/stores/player'
import { ElMessageBox } from 'element-plus'
import Playlist from '@/views/components/Playlist.vue'

const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const playerStore = usePlayerStore()
const { play, setPlayData } = playerStore
const collectStore = useCollectStore()
const collect = computed(() => collectStore.collect)
const current = computed(() => collectStore.current)
const playlistRef = ref(null)
const playlist = ref([])
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
</script>
<style></style>
