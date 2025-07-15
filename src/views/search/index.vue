<template>
  <div class="search" v-loading="pageLoading">
    <div class="border-b border-[var(--el-menu-border-color)] pb-4">
      <el-autocomplete placeholder="请输入搜索内容" clearable v-model="keyword" :fetch-suggestions="debounce(queryKeywords, 400)" size="large" @select="onSearch" @change="debounce(onSearch, 400)">
        <template #prepend>
          <el-select
            size="large"
            class="!w-[110px]"
            v-model="type"
            @change="
              () => {
                currentPage = 1
                playlistRef.setScrollTop(0)
                onSearch()
              }
            "
          >
            <el-option v-for="item in types" :key="item.type" :label="item.title" :value="item.type" />
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
              currentPage = 1
              playlistRef.setScrollTop(0)
              onSearch()
            }
          "
          >{{ item.name }}</el-tag
        >
      </el-scrollbar>
    </div>
    <Playlist ref="playlistRef" :showHeader="false" header-class="mt-5 !pl-0" action-class="mt-2" v-loading="loading" :data="{ info: { id: keyword, total_song_num: total || playlist.length }, tracks: playlist }" :tableProps="{ height: 'calc(100vh - 410px)' }">
      <template #action>
        <div class="relative flex-1 flex items-center justify-between">
          <el-button type="primary" @click="playlistRef.handlePlayAll" :disabled="!playlist.length || loading"
            ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
          >
          <el-segmented
            v-model="stype"
            :disabled="!keyword || loading"
            :options="cates"
            size="large"
            :props="{ label: 'title', value: 'path' }"
            @change="
              () => {
                currentPage = 1
                playlistRef.setScrollTop(0)
                onSearch()
              }
            "
          />
        </div>
      </template>
      <template #pagination>
        <div class="flex justify-end mt-2">
          <el-pagination layout="total, prev, pager, next, jumper, ->" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="onSearch" />
        </div>
      </template>
    </Playlist>
  </div>
</template>
<script name="search" setup>
import { debounce } from 'lodash-es'
import { computed, getCurrentInstance, ref } from 'vue'
import { useRoute } from 'vue-router'
import Playlist from '@/views/components/Playlist.vue'
import { useConfigStore } from '@/stores/config'
const { config } = useConfigStore()
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
const types = computed(() => config.types)
const cates = ref([
  { title: '单曲', path: '0' },
  { title: '歌单', path: '1' },
  { title: '专辑', path: 'album' },
  { title: '歌手', path: 'singer' },
  { title: '用户', path: 'user' },
])
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)
const pageSize = ref(15)
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
  let results = await fetch(`${$apiUrl}/music/search?keyword=${keyword.value}&type=${type.value}&searchType=${stype.value}&limit=${pageSize.value}&page=${currentPage.value}`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch(() => {
      loading.value = false
    })
  playlist.value = results.result.map((el) => {
    if (!el.duration || typeof el.duration !== 'number') return { ...el, duration: el.duration || '--' }
    let duration = Math.floor(el.duration / 60 / 1000) + ':' + (el.duration % 60 > 9 ? el.duration % 60 : '0' + (el.duration % 60))
    if (Math.floor(el.duration / 60) < 10) {
      duration = '0' + duration
    }
    return { ...el, duration: el.durationStr ? el.durationStr : duration || '--' }
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
