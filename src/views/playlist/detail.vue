<template>
  <div class="playlist-detail !overflow-hidden">
    <div class="h-[calc(100vh-140px)] max-h-[auto] md:min-h-[calc(100vh-140px)] rounded-md overflow-y-auto md:!overflow-hidden" v-loading="loading">
      <Playlist :data="data" :tableProps="{ height: config.isMobile ? null : 'calc(100vh - 300px)' }" :show-actions="true">
        <template #header>
          <div class="md:flex mb-3 min-h-[120px] relative rounded overflow-hidden">
            <Image :src="data.info.cover_img_url" class="h-[300px] md:w-[120px] md:h-[120px] rounded scale-[2] md:scale-[1]"></Image>
            <div class="info md:ml-4 p-2 text-shadow-lg md:text-shadow-none text-[var(--vt-c-text-dark-1)] md:text-[var(--el-color-regular)] md:p-0 flex-1 absolute h-full w-full md:relative backdrop-blur-3xl left-0 top-0 right-0 flex flex-col justify-center">
              <div class="title text-3xl mb-2">{{ data.info.title }}</div>
              <div v-if="data.info.desc">
                <el-tooltip placement="top" v-if="data.info.desc.replace(/<br>/g, '。').length > 100">
                  <div class="desc md:line-clamp-3" v-if="data.info.desc" v-html="data.info.desc.replace(/<br>/g, '。')"></div>
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
import { useConfigStore } from '@/stores/config'
const { config } = useConfigStore()
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
  try {
    const response = await fetch(`${$apiUrl}/music/detail?type=${route.query.type}&id=${route.params.id}`)
    let res = await response.json()
    loading.value = false
    data.value = res.data || { info: {} }
  } catch (err) {
    loading.value = false
    console.log(err)
  }
}
watch(playIndex, () => {
  tableRef.value?.setScrollTop(playIndex.value * 40)
})
fetchData()
</script>
<style></style>
