<template>
  <div class="search" v-loading="pageLoading">
    <div class="border-b border-[var(--el-menu-border-color)] pb-4">
      <el-autocomplete placeholder="请输入搜索内容" clearable v-model="keyword" :fetch-suggestions="debounce(queryKeywords, 400)" size="large" @select="onSearch" @change="debounce(onSearch, 400)">
        <template #prepend>
          <el-select size="large" class="!w-[110px]" v-model="type" @change="onSearch">
            <el-option label="企鹅音乐" value="qq" />
            <el-option label="网易音乐" value="netease" />
            <el-option label="酷狗音乐" value="kugou" />
            <el-option label="酷我音乐" value="kuwo" />
            <el-option label="千千音乐" value="qianqian" />
            <el-option label="咪咕音乐" value="migu" />
          </el-select>
        </template>
        <template #append>
          <el-button @click="onSearch" :disabled="loading || !keyword"
            ><el-icon><Search /></el-icon
          ></el-button>
        </template>
      </el-autocomplete>
    </div>
    <div class="keywords rounded mt-4 border border-[var(--el-menu-border-color)] pt-2">
      <el-scrollbar class="flex flex-wrap" height="64px">
        <el-tag
          class="max-w-[200px] mx-2 mb-2 cursor-pointer"
          v-for="item in hots"
          :key="item.name"
          @click="
            () => {
              keyword = item.name
              onSearch()
            }
          "
          >{{ item.name }}</el-tag
        >
      </el-scrollbar>
    </div>
    <div class="relative">
      <div class="flex justify-between my-5 items-center">
        <el-button type="primary" @click="playlistRef.handlePlayAll" :disabled="!playlist.length || loading"
          ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
        >
        <el-segmented v-model="stype" :disabled="!keyword || loading" :options="cates" size="large" :props="{ label: 'title', value: 'path' }" @change="onSearch" />
      </div>
      <Playlist ref="playlistRef" v-loading="loading" :data="{ info: { id: keyword }, tracks: playlist }" :tableProps="{ maxHeight: 'calc(100vh - 388px)' }" />
    </div>
  </div>
</template>
<script name="search" setup>
import { debounce } from 'lodash-es'
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
const stype = ref('0')
const type = ref('qq')
const cates = ref([
  { title: '单曲', path: '0' },
  { title: '专辑', path: 'album' },
  { title: '歌手', path: 'singer' },
  { title: '歌单', path: 'playlist' },
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
  let results = await fetch(`${$apiUrl}/music/search?keyword=${keyword.value}&type=${type.value}&searchType=${stype.value}&limit=20&offset=0`)
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
  cates.value[0].title = `单曲(${total.value})`
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
