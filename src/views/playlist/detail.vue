<template>
  <div class="playlist-detail !overflow-hidden backdrop-blur-sm">
    <div class="md:h-[calc(100vh-140px)] min-h-[calc(100vh-180px)] md:min-h-[calc(100vh-140px)] rounded-md overflow-y-auto md:!overflow-hidden">
      <Playlist ref="tableRef" showSkeleton :loading="loading" :data="data" :tableProps="{ height: config.isMobile ? null : 'calc(100vh - 300px)', showHeader: !config.isMobile }" :show-actions="true">
        <template #header>
          <div class="md:flex mb-3 min-h-[100px] w-full md:min-h-[100px] relative rounded overflow-hidden" element-loading-custom-class="backdrop-blur !z-99">
            <Image v-if="data.info.cover_img_url || '/logo.svg'" :src="data.info.cover_img_url" :size="120" class="absolute h-[180px] m-[auto] md:w-[120px] md:h-[120px] rounded scale-[2] blur-[200px] md:blur-[0px] md:scale-[1]"></Image>
            <div class="info md:ml-4 p-2 rounded overflow-hidden md:p-0 flex-1 absolute h-full w-full md:relative backdrop-blur-2xl md:backdrop-blur-none left-0 top-0 right-0 flex flex-col justify-center md:justify-start">
              <div class="title text-3xl mb-2">{{ data.info.title }}</div>
              <div v-if="data.info.desc" class="hidden md:block">
                <el-tooltip placement="top" v-if="data.info.desc.replace(/<br>/g, '。').length > 100">
                  <div class="desc md:line-clamp-3 text-justify" v-if="data.info.desc" v-html="data.info.desc.replace(/<br>/g, '。')"></div>
                  <template #content>
                    <el-scrollbar max-height="300px">
                      <div class="max-w-[400px] hidden md:block" v-html="data.info.desc.replace(/<br>/g, '。')"></div>
                    </el-scrollbar>
                  </template>
                </el-tooltip>
                <div v-else v-html="data.info.desc.replace(/<br>/g, ';')"></div>
              </div>
              <el-scrollbar max-height="190px" class="md:!hidden desc" v-if="data.info.desc">
                <div v-html="data.info.desc.replace(/<br>/g, ';')"></div>
              </el-scrollbar>
            </div>
          </div>
        </template>
        <template #table-action="scope">
          <div v-if="!config.isMobile">
            <el-link type="primary" size="small" @click="onAction('play', scope.row)"
              ><el-icon :size="28"> <icon-play /> </el-icon
            ></el-link>
            <el-link type="primary" size="small" class="ml-2" @click="onAction('star', scope.row)">
              <el-icon :size="18">
                <Delete v-if="data.info && data.info.id == 0" />
                <icon-heart-fill v-else-if="collectStore.has(scope.row.id, 'song')" />
                <icon-heart v-else />
              </el-icon>
            </el-link>
          </div>
          <el-dropdown trigger="click" :show-arrow="false" popper-class="backdrop-blur !z-30000" @command="(command) => onAction(command, scope.row)" v-else>
            <el-icon class="transform rotate-90"><MoreFilled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="text-xs" command="play"
                  ><el-icon :size="20" class="mr-2 !text-[var(--el-color-primary)]"><video-play /></el-icon>播放歌曲</el-dropdown-item
                >
                <el-dropdown-item class="text-xs" command="star">
                  <el-icon :size="20" v-if="data.info && data.info.id == 0" class="!text-[var(--el-color-danger)]">
                    <Delete />
                  </el-icon>
                  <el-icon :size="20" class="mr-2 !text-[var(--el-color-danger)]" v-else> <icon-heart-fill v-if="collectStore.has(scope.row.id, 'song')" /> <icon-heart v-else /></el-icon
                  >{{ data.info && data.info.id == 0 ? '移除歌曲' : collectStore.has(scope.row.id, 'song') ? '取消收藏' : '收藏歌曲' }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </Playlist>
      <el-backtop target=".playlist-detail .el-scrollbar__wrap" :bottom="80" :right="15">
        <el-icon><Top /></el-icon>
      </el-backtop>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
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
const reachedEnd = computed(() => config.reachedEnd)
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
watch(reachedEnd, () => {
  tableRef.value?.loadData()
})
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

const onAction = (command, row) => {
  switch (command) {
    case 'play':
      tableRef.value?.handlePlay(row)
      break
    case 'star':
      collectStore.has(row.id, 'song')
        ? ElMessageBox.confirm('确定取消收藏？', '提示', {
            customClass: 'backdrop-blur',
          })
            .then(() => {
              if (data.value.info.id == 0) {
                data.value.tracks = data.value.tracks.filter((item) => item.id !== row.id)
              }
              collectStore.toggleCollect(row, 'song')
            })
            .catch(() => {})
        : collectStore.toggleCollect(row, 'song')
      break
    default:
      break
  }
}
</script>
<style scoped>
.desc {
  box-shadow: 0px 0px 100px var(--el-bg-color);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #fff 10%, #fff 50%, transparent 100%);
}
html.dark .desc {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 10%, #000 50%, transparent 100%);
}
</style>
