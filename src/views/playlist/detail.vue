<template>
  <div class="playlist-detail !overflow-hidden">
    <div class="min-h-[60vh]" v-loading="loading">
      <Playlist :data="data" :tableProps="{ maxHeight: 'calc(100vh - 300px)' }">
        <template #header>
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
        </template>
      </Playlist>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Playlist from '@/views/components/Playlist.vue'
import { usePlayerStore } from '@/stores/player'
const playerStore = usePlayerStore()
const { playData } = playerStore
const route = useRoute()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const loading = ref(true)
const playIndex = computed(() => playData.playIndex)
const tableRef = ref(null)
const data = ref({
  info: {},
  tracks: [],
})
const fetchData = async () => {
  loading.value = true
  const response = await fetch(`${$apiUrl}/music/detail?type=${route.query.type}&id=${route.params.id}`)
  let res = await response.json()
  loading.value = false
  data.value = res.data
}
watch(playIndex, () => {
  tableRef.value?.setScrollTop(playIndex.value * 40)
})
fetchData()
</script>
<style></style>
