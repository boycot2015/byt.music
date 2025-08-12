<template>
  <div class="playlist-detail !overflow-hidden">
    <div class="md:h-[calc(100vh-140px)] max-h-[auto] md:min-h-[calc(100vh-140px)] rounded-md overflow-y-auto md:!overflow-hidden" v-loading="loading" element-loading-custom-class="backdrop-blur !z-99">
      <Playlist ref="tableRef" :data="data" :tableProps="{ height: config.isMobile ? null : 'calc(100vh - 300px)' }" :show-actions="true">
        <template #header>
          <div class="md:flex mb-3 min-h-[120px] relative rounded overflow-hidden">
            <Image v-if="data.info.cover_img_url" :src="data.info.cover_img_url" :size="120" class="absolute h-[300px] m-[auto] md:w-[120px] md:h-[120px] rounded scale-[2] md:scale-[1]"></Image>
            <div
              class="info md:ml-4 p-2 rounded overflow-hidden text-shadow-lg md:text-shadow-none text-[var(--vt-c-text-dark-1)] md:text-[var(--el-color-regular)] md:p-0 flex-1 absolute h-full w-full md:relative backdrop-blur-xl md:backdrop-blur-none left-0 top-0 right-0 flex flex-col justify-center"
            >
              <div class="title text-3xl mb-2">{{ data.info.title }}</div>
              <div v-if="data.info.desc" class="hidden md:block">
                <el-tooltip placement="top" v-if="data.info.desc.replace(/<br>/g, '。').length > 100">
                  <div class="desc md:line-clamp-3" v-if="data.info.desc" v-html="data.info.desc.replace(/<br>/g, '。')"></div>
                  <template #content>
                    <el-scrollbar max-height="300px">
                      <div class="max-w-[400px] hidden md:block" v-html="data.info.desc.replace(/<br>/g, '。')"></div>
                    </el-scrollbar>
                  </template>
                </el-tooltip>
                <div v-else v-html="data.info.desc.replace(/<br>/g, ';')"></div>
              </div>
              <el-scrollbar max-height="190px" class="md:!hidden" v-if="data.info.desc">
                <div v-html="data.info.desc.replace(/<br>/g, ';')"></div>
              </el-scrollbar>
            </div>
          </div>
        </template>
        <template #table-action="scope">
          <el-link type="primary" size="small" @click="() => tableRef.handlePlay(scope.row)"
            ><el-icon :size="22"> <icon-play /> </el-icon
          ></el-link>
          <el-link
            type="primary"
            size="small"
            class="ml-2"
            @click="
              () => {
                collectStore.has(scope.row.id, 'song')
                  ? ElMessageBox.confirm('确定取消收藏？')
                      .then(() => {
                        data.info.id == 0 && (data.tracks = data.tracks.filter((item) => item.id !== scope.row.id))
                        collectStore.toggleCollect(scope.row, 'song')
                      })
                      .catch(() => {})
                  : collectStore.toggleCollect(scope.row, 'song')
              }
            "
          >
            <el-icon>
              <Delete v-if="data.info && data.info.id == 0" />
              <icon-heart-fill v-else-if="collectStore.has(scope.row.id, 'song')" />
              <icon-heart v-else />
            </el-icon>
          </el-link>
        </template>
      </Playlist>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, watch, onMounted, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import Playlist from '@/views/components/Playlist.vue'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import { useCollectStore } from '@/stores/collect'
const collectStore = useCollectStore()
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
  if (route.params.id == 0) {
    let current = collectStore.collect.find((item) => item.info.id == 0)
    data.value.tracks = current?.tracks || []
    data.value.info = current?.info || {}
    loading.value = false
    return
  }
  try {
    const response = await fetch(`${$apiUrl}/music/detail?type=${route.query.type}&id=${route.params.id}`)
    let res = await response.json()
    loading.value = false
    data.value = res.data || { info: {}, tracks: [] }
  } catch (err) {
    loading.value = false
    console.log(err)
  }
}
watch(playIndex, () => {
  tableRef.value?.setScrollTop(playIndex.value * 40)
})
fetchData()
onMounted(() => {
  tableRef.value?.setScrollTop(0)
})
onActivated(() => {
  tableRef.value?.setScrollTop(0)
})
</script>
<style></style>
