<template>
  <div class="search">
    <div class="pb-4">
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
    <div class="keywords rounded my-1 md:my-2 border border-[var(--el-menu-border-color)] pt-2 rounded-md" v-loading="keywordLoading">
      <el-scrollbar class="flex flex-wrap" height="64px">
        <template v-if="hots.length">
          <el-tag
            class="mx-2 mb-2 cursor-pointer whitespace-normal"
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
        </template>
        <Empty v-else-if="!keywordLoading"></Empty>
      </el-scrollbar>
    </div>
    <Playlist ref="playlistRef" :showHeader="false" header-class="!pl-0" action-class="mt-2" v-loading="loading" :data="{ info: { id: keyword, total_song_num: total || playlist.length }, tracks: playlist }" :tableProps="{ height: 'calc(100vh - 380px)' }">
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
            :props="{ label: 'title', value: 'value' }"
            @change="
              () => {
                currentPage = 1
                playlistRef.setScrollTop(0)
                onSearch()
              }
            "
          >
            <template #default="{ item }">
              {{ item.title }}
              <span v-if="item.total">({{ item.total }})</span>
            </template>
          </el-segmented>
        </div>
      </template>
      <template #pagination>
        <div class="flex justify-center md:justify-end mt-2">
          <el-pagination class="!hidden md:!flex" layout="total, prev, pager, next, jumper, ->" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="onSearch" />
          <el-pagination class="!flex md:!hidden" size="small" layout="prev, pager, next, jumper, ->" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="onSearch" />
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
const keywordLoading = ref(false)
const total = ref(0)
const hasNextPage = ref(false)
const keyword = ref('')
const stype = ref('0')
const type = ref('qq')
const types = computed(() => config.types)
const cates = ref([
  { title: '单曲', value: '0' },
  { title: '歌单', value: '1' },
  // { title: '专辑', value: 'album' },
  // { title: '歌手', value: 'singer' },
  // { title: '用户', value: 'user' },
])
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)
const pageSize = ref(15)
const fetchData = async () => {
  keywordLoading.value = true
  currentPage.value = 1
  const response = await fetch(`${$musicApiUrl}/search/hot/detail`).then((res) => res.json())
  hots.value = response.data?.map((el) => ({ ...el, name: el.searchWord }))
  keywordLoading.value = false
}
const queryKeywords = async (queryString, cb) => {
  let results = await fetch(`${$musicApiUrl}/search/hot`)
    .then((res) => res.json())
    .then((res) => res.result.hots.map((el) => ({ ...el, value: el.first })))
    .catch(() => {
      keywordLoading.value = false
    })
  results = results.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
  cb(results)
}
const onSearch = async () => {
  loading.value = true
  cates.value.map((el) => {
    if (el.value !== stype.value) {
      el.total = 0
    }
  })
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
  cates.value.map((el) => {
    if (el.value === stype.value) {
      el.total = results.total
    }
  })
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
