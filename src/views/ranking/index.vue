<template>
  <div class="ranking overflow-hidden" v-loading="pageLoading">
    <el-row :gutter="20">
      <el-col :span="8" class="flex flex-col border-r border-[var(--el-color-primary)]">
        <el-select v-model="type" @change="onSearch">
          <el-option v-for="item in cates" :key="item.name" :label="item.title" :value="item.path" />
        </el-select>
        <el-scrollbar>
          <el-menu class="flex h-[calc(100vh-180px)] !border-0">
            <el-menu-item> {{ 12312 }} </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-col>
      <el-col :span="16">
        <div class="relative">
          <div class="flex justify-between items-center">
            <el-button type="primary" @click="playlistRef.handlePlayAll" :disabled="!playlist.length || loading"
              ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
            >
          </div>
          <Playlist ref="playlistRef" v-loading="loading" :data="{ info: { id: keyword }, tracks: playlist }" :tableProps="{ maxHeight: 'calc(100vh - 288px)' }" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script name="search" setup>
import { getCurrentInstance, ref } from 'vue'
import { useRoute } from 'vue-router'
import Playlist from '@/views/components/Playlist.vue'
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const $musicApiUrl = proxy.$musicApiUrl
const route = useRoute()
const hots = ref([])
const playlist = ref([])
const playlistRef = ref([])
const loading = ref(false)
const pageLoading = ref(false)
const total = ref(0)
const hasNextPage = ref(false)
const keyword = ref('')
const type = ref('qq')
const cates = ref([
  { title: '企鹅音乐', path: 'qq' },
  { title: '网易音乐', path: 'netease' },
  { title: '酷狗音乐', path: 'kugou' },
  { title: '酷我音乐', path: 'kuwo' },
  { title: '千千音乐', path: 'qianqian' },
  { title: '咪咕音乐', path: 'migu' },
])
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)
const fetchData = async () => {
  pageLoading.value = true
  currentPage.value = 1
  const response = await fetch(`${$musicApiUrl}/search/hot/detail`).then((res) => res.json())
  hots.value = response.data?.map((el) => ({ ...el, name: el.searchWord }))
  pageLoading.value = false
}
const queryKeywords = async (queryString, cb) => {
  let results = await fetch(`${$musicApiUrl}/search/hot`)
    .then((res) => res.json())
    .then((res) => res.result.hots.map((el) => ({ ...el, value: el.first })))
  results = results.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
  cb(results)
}
const onSearch = async () => {
  loading.value = true
  let results = await fetch(`${$apiUrl}/music?type=${type.value}&limit=20&offset=0`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch(() => {
      loading.value = false
    })
  playlist.value = results.result.map((el) => {
    let duration = Math.floor(el.duration / 60 / 1000) + ':' + (el.duration % 60 > 9 ? el.duration % 60 : '0' + (el.duration % 60))
    if (Math.floor(el.duration / 60) < 10) {
      duration = '0' + duration
    }
    return { ...el, duration: el.durationStr ? el.durationStr : duration }
  })
  hasNextPage.value = results.hasMore
  total.value = results.total
  loading.value = false
}
fetchData()
</script>

<style>
@media (min-widurationh: 1024px) {
  .about {
    min-height: 50vh;
    display: flex;
    align-items: center;
  }
}
</style>
