<template>
  <div class="ranking">
    <el-row :gutter="20" class="overflow-hidden">
      <el-col :span="24" :sm="8" :md="6" :lg="4" class="flex flex-col md:border-r md:border-[var(--el-border-color)]">
        <el-select v-model="type" @change="fetchData" size="large" popper-class="backdrop-blur">
          <el-option v-for="item in types" :key="item.type" :label="item.title" :value="item.type" />
        </el-select>
        <el-scrollbar ref="scrollbarRef" always class="!mt-[10px]" height="calc(100vh - 190px)" v-loading="pageLoading" element-loading-custom-class="backdrop-blur !z-99" v-if="!config.isMobile">
          <el-menu :default-active="activePlayIndex" class="!border-0 h-full rounded-md overflow-hidden" v-if="cates[type] && cates[type]?.playlist.length" @select="fetchPlayList">
            <el-menu-item v-for="item in cates[type]?.playlist || []" :key="item.id" :index="item.id + ''" class="!whitespace-normal !leading-[20px] !pl-0 !pr-0 md:!pr-4">
              <div class="flex items-center flex-wrap">
                <Image lazy class="w-[32px] h-[32px] mr-2 rounded" :src="item.cover_img_url" fit="cover" />
                <span class="!line-clamp-2 flex-1 hidden md:block">{{ item.title }}</span>
              </div>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
        <el-row :gutter="16" class="overflow-hidden pt-2" v-else>
          <el-col :xs="8" :sm="6" class="overflow-hidden rounded mb-2" v-for="item in cates[type]?.playlist || []" :key="item.id">
            <el-skeleton :loading="animateLoading" animated>
              <template #template>
                <div class="w-full mb-1">
                  <el-skeleton-item variant="image" class="!rounded" style="width: 100%; height: 105px" />
                  <el-skeleton-item variant="p" class="mb-[0] mt-2" style="width: 100%" />
                  <el-skeleton-item variant="p" style="width: 80%" />
                </div>
              </template>
              <template #default>
                <div class="flex flex-col items-center flex-wrap cursor-pointer" @click="router.push({ path: `/playlist/${item.id}`, query: { type: type } })">
                  <Image lazy class="w-full h-full min-w-[100px] min-h-[105px] mr-2 rounded" :src="item.cover_img_url" :size="100" fit="cover" />
                  <h3 class="line-clamp-2 flex-1 leading-[22px] mt-1">{{ item.title }}</h3>
                </div>
              </template>
            </el-skeleton>
          </el-col>
        </el-row>
        <Empty v-if="!animateLoading && !cates[type]?.playlist.length" />
      </el-col>
      <el-col :span="0" :sm="16" :md="18" :lg="20">
        <Playlist :loading="loading" ref="playlistRef" :data="{ info: playlistInfo, tracks: playlist, id: playlistInfo.id, type }" :tableProps="{ height: 'calc(100vh - 190px)' }">
          <template #action>
            <div class="justify-end items-center mb-2" v-if="playlistRef">
              <el-button type="primary" @click="playlistRef.handlePlayAll" :disabled="!playlist.length || loading"
                ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
              >
              <el-button type="warning" @click="() => playlistRef?.toggleCollect()" :disabled="!playlistInfo || !playlist.length || loading"
                ><el-icon class="mr-2"><IconHeartFill v-if="playlistRef?.isCollect(playlistInfo.id)" /> <IconHeart v-else /></el-icon> {{ playlistRef?.isCollect(playlistInfo.id) ? '已' : '' }}收藏</el-button
              >
              <el-link :href="playlistInfo?.source_url" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3">
                <el-button :disabled="!playlistInfo || !playlist.length || loading"
                  ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
                >
              </el-link>
            </div>
          </template>
          <template #table-action="scope">
            <el-link type="primary" size="small" @click="() => playlistRef.handlePlay(scope.row)"
              ><el-icon :size="28"> <icon-play /> </el-icon
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
                          playlistInfo.id == 0 && (data.tracks = data.tracks.filter((item) => item.id !== scope.row.id))
                          collectStore.toggleCollect(scope.row, 'song')
                        })
                        .catch(() => {})
                    : collectStore.toggleCollect(scope.row, 'song')
                }
              "
            >
              <el-icon :size="18">
                <Delete v-if="playlistInfo && playlistInfo.id == 0" />
                <icon-heart-fill v-else-if="collectStore.has(scope.row.id, 'song')" />
                <icon-heart v-else />
              </el-icon>
            </el-link>
          </template>
        </Playlist>
      </el-col>
    </el-row>
  </div>
</template>
<script name="search" setup>
import Playlist from '@/views/components/Playlist.vue'
import { useConfigStore } from '@/stores/config'
import { useCollectStore } from '@/stores/collect'
import { useRouter } from 'vue-router'
const router = useRouter()
const { config } = useConfigStore()
const collectStore = useCollectStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const playlist = ref([])
const playlistRef = ref(null)
const loading = ref(false)
const pageLoading = ref(false)
const animateLoading = ref(true)
const keyword = ref('')
const type = ref('qq')
const ctype = ref('toplist')
const activePlayIndex = ref('0')
const types = computed(() => config.types)
const cates = ref({})
const playlistInfo = ref({})
const scrollbarRef = ref(null)
const fetchData = () => {
  pageLoading.value = true
  loading.value = true
  animateLoading.value = true
  scrollbarRef.value?.setScrollTop(0)
  if (cates.value[type.value]?.playlist?.length) {
    fetchPlayList(cates.value[type.value].playlist[0]?.id + '')
    pageLoading.value = false
    animateLoading.value = false
    return
  }
  cates.value[type.value] = { playlist: [], hasMore: false, total: 0 }
  cates.value[type.value].playlist = new Array(9).fill('').map((_, index) => ({
    id: (index + 1).toString(),
  }))
  fetch(`${$apiUrl}/music?type=${type.value}&id=${type.value == 'netease' ? '排行榜' : ctype.value}&limit=20&offset=0`)
    .then((res) => res.json())
    .then((res) => res.data)
    .then((results) => {
      cates.value[type.value].playlist = results.result
      cates.value[type.value].hasMore = results.hasMore || results.hasNextPage || false
      cates.value[type.value].total = results.total
      fetchPlayList(cates.value[type.value].playlist[0]?.id + '')
      pageLoading.value = false
      animateLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
      animateLoading.value = false
    })
}
const fetchPlayList = async (id) => {
  activePlayIndex.value = id
  loading.value = true
  keyword.value = id
  let results = await fetch(`${$apiUrl}/music/detail?type=${type.value}&cate=${ctype.value}&id=${id}`)
    .then((res) => res.json())
    .then((res) => res.data || {})
    .catch(() => {
      loading.value = false
    })
  playlist.value = results.tracks || []
  playlistInfo.value = results.info || {}
  loading.value = false
  playlistRef.value?.setScrollTop(0)
}
onMounted(() => {
  fetchData()
})
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
