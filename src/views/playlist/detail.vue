<template>
  <div class="playlist-detail !overflow-hidden">
    <div class="min-h-[60vh]" v-loading="loading">
      <div class="actions text-right fixed top-4 right-2" v-if="showActions">
        <el-button type="primary" @click="handlePlayAll"
          ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
        >
        <el-button type="warning" @click="handleCollect"
          ><el-icon class="mr-2"><IconHeart /></el-icon> 收藏</el-button
        >
        <el-link :href="data.info.source_url" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3">
          <el-button
            ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
          >
        </el-link>
      </div>
      <div class="flex mb-3 min-h-[120px]">
        <el-image :src="data.info.cover_img_url" class="w-[120px] h-[120px] rounded"></el-image>
        <div class="info ml-4 flex-1">
          <div class="title text-xl mb-2">{{ data.info.title }}</div>
          <div v-if="data.info.desc">
            <el-tooltip placement="top" v-if="data.info.desc.replace(/<br>/g, '。').length > 100">
              <div class="desc text-[#444] line-clamp-3" v-if="data.info.desc" v-html="data.info.desc.replace(/<br>/g, '。')"></div>
              <template #content>
                <el-scrollbar max-height="300px">
                  <div class="max-w-[400px]" v-html="data.info.desc.replace(/<br>/g, '。')"></div>
                </el-scrollbar>
              </template>
            </el-tooltip>
            <div v-else v-html="data.info.desc.replace(/<br>/g, ';')"></div>
          </div>
        </div>
      </div>
      <el-table :row-class-name="({ row, rowIndex }) => (playData.playIndex == rowIndex - 1 ? 'current-row' : '')" max-height="calc(100vh - 300px)" :data="data.tracks" @row-dblclick="handlePlay">
        <el-table-column prop="title" label="歌曲名称" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.title }}
            <span v-if="scope.row.quality == 'HQ'" class="text-[green] text-[12px]">{{ scope.row.quality }}</span>
            <span v-else class="text-[purple] text-[12px]">{{ scope.row.quality }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="artist" label="艺术家"></el-table-column>
        <el-table-column prop="album" show-overflow-tooltip label="专辑名称"></el-table-column>
        <el-table-column prop="duration" width="120px" label="歌曲时长"></el-table-column>
      </el-table>
    </div>
    <!-- {{ data.tracks && data.tracks[0].source_url }} -->
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VideoPlay, Link } from '@element-plus/icons-vue'
import IconHeart from '@/components/icons/IconHeart.vue'
import { usePlayerStore } from '@/stores/player'
import { useCollectStore } from '@/stores/collect'
const playerStore = usePlayerStore()
const collectStore = useCollectStore()
const { play, playData, setPlayData } = playerStore
const router = useRouter()
const route = useRoute()
console.log(route.params)
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const loading = ref(true)
const showActions = ref(false)
const data = ref({
  info: {},
  tracks: [],
})
const fetchData = async () => {
  loading.value = true
  const response = await fetch(`${$apiUrl}/music/detail?type=${route.query.type}&id=${route.params.id}`)
  let res = await response.json()
  loading.value = false
  setTimeout(() => {
    showActions.value = true
  }, 450)
  data.value = res.data
}
const handlePlayAll = () => {
  play(data.value.tracks)
}
const handlePlay = (row) => {
  setPlayData({ playIndex: playData.playlist?.findIndex((item) => item.id == row.id) })
  play(row)
}
const handleCollect = () => {
  collectStore.add(data.value)
}
fetchData()
</script>
<style></style>
