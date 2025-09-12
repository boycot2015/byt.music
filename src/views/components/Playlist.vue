<template>
  <div class="playlist-detail !overflow-hidden rounded-md">
    <el-skeleton :loading="loading && showSkeleton" animated>
      <template #template>
        <div class="w-full md:flex">
          <el-skeleton-item variant="image" class="!rounded w-full md:!w-[160px]" style="width: 100%; height: 160px" />
          <div class="flex md:flex-col flex-1 space-x-2 my-2 md:my-0 md:ml-4">
            <el-skeleton-item variant="h1" class="!w-[30%] mr-2 mb-2 !hidden md:!block" />
            <el-skeleton-item variant="p" v-for="item in 4" :key="item" class="w-[100%] mr-2 md:my-2 !hidden md:!block" :class="{ '!w-[50%]': item == 4 }" />
            <el-skeleton-item variant="button" v-for="item in 3" :key="item" class="!w-[30%] mr-2 md:!hidden" />
          </div>
        </div>
        <div style="margin-top: 10px">
          <el-skeleton-item v-for="item in 5" :key="item" variant="text" style="width: 20%; height: 34px" />
          <el-skeleton-item v-for="item in 12" :key="item" variant="p" style="width: 100%; height: 34px" />
        </div>
      </template>
      <template #default>
        <div class="flex flex-col overflow-hidden md:flex-row justify-between md:pl-3 w-full relative" :class="headerClass">
          <slot name="header" v-if="showHeader">
            <div class="flex items-center w-full md:!w-[auto] min-h-[140px] md:min-h-[auto]">
              <div class="text-xs flex items-center" v-if="data?.info?.nickname || data?.info?.title">
                <el-avatar class="mr-2" size="small" v-if="data?.info?.headurl" :src="data?.info?.headurl"></el-avatar>
                <el-icon class="mr-2" :size="20" v-else><User /></el-icon>
                <span class="line-clamp-1">{{ data?.info?.nickname || data?.info?.title }}</span>
                <el-divider class="!border-l-[var(--color-text)]" direction="vertical" />
              </div>
              <div class="text-xs flex items-center line-clamp-1 hidden lg:flex" v-if="data?.info?.ctime">
                <span class="text-xs line-clamp-1">{{ data?.info?.ctime ? new Date(data?.info?.ctime).toLocaleString().split(' ')[0].replace(/\//g, '-') : '--' }}</span>
                <el-divider class="!border-l-[var(--color-text)]" direction="vertical" />
              </div>
              <div class="text-xs line-clamp-1 hidden lg:flex" v-if="data?.info?.play_count">
                <span>{{ data?.info?.play_count ? (data?.info.play_count > 10000 ? (data?.info?.play_count / 10000).toFixed(1) + '万次播放' : data?.info.play_count + '次播放') : '--' }}</span>
                <el-divider class="!border-l-[var(--color-text)]" direction="vertical" />
              </div>
              <div class="text-xs line-clamp-1">
                <span class="text-[var(--el-color-primary)]">{{ data?.info?.total_song_num || data.tracks.length || 0 }}</span> 首歌曲
              </div>
            </div>
          </slot>
          <slot name="action">
            <div class="actions w-full mb-1 md:mb-0 md:w-[auto] flex md:text-right md:absolute bottom-5 right-2" :class="actionClass" v-if="showActions && data.info">
              <el-button type="primary" @click="handlePlayAll" :disabled="!data.info.id && !data.tracks.length"
                ><el-icon class="mr-2"><VideoPlay /></el-icon>播放全部<span class="text-xs" v-if="data?.info?.total_song_num">({{ data?.info?.total_song_num || 0 }})</span></el-button
              >
              <el-button type="warning" @click="toggleCollect" :disabled="!data.info.id" v-if="data?.info?.id"
                ><el-icon class="mr-2"><IconHeartFill v-if="collectStore.has(data.info.id)" /> <IconHeart v-else /></el-icon> {{ collectStore.has(data.info.id) ? '已' : '' }}收藏</el-button
              >
              <el-link :href="data.info.source_url" v-if="data?.info?.id" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3 self-end">
                <el-button :disabled="!data.info.id"
                  ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
                >
              </el-link>
            </div>
          </slot>
        </div>
        <el-table
          ref="tableRef"
          class="rounded overflow-hidden"
          v-loading="loading"
          element-loading-custom-class="backdrop-blur !z-99"
          v-if="data.tracks"
          :row-class-name="({ row, rowIndex }) => (playData.id == row.id ? 'current-row' : '')"
          v-bind="tableProps"
          v-on="tableEvents"
          :data="data.tracks"
          @row-dblclick="handlePlay"
        >
          <el-table-column v-if="!showTableHeader" align="center" min-width="30px" type="index" :index="(val) => val + 1" show-overflow-tooltip></el-table-column>
          <el-table-column prop="title" min-width="220px" label="歌曲名" :show-overflow-tooltip="showTableHeader">
            <template #default="scope">
              <div v-if="showTableHeader">
                {{ scope.row.title }}
                <span v-if="scope.row.quality == 'HQ'" class="text-[green] text-[12px]">{{ scope.row.quality }}</span>
                <span v-else class="text-[purple] text-[12px]">{{ scope.row.quality }}</span>
              </div>
              <div v-else>
                <p class="line-clamp-1 text-lg text-[var(--el-text-color-primary)]">{{ scope.row.title }}</p>
                <div class="text-[12px] line-clamp-1 text-[var(--el-text-color-secondary)]">
                  <span v-if="scope.row.quality == 'HQ'" class="text-[green]">{{ scope.row.quality }}</span>
                  <span v-else class="text-[purple] ml-1">{{ scope.row.quality }}</span>
                  {{ scope.row.artist || scope.row.singer || '--' }}
                  <span class="ml-1" v-if="scope.row.album?.name || scope.row.album">- {{ scope.row.album?.name || scope.row.album || '--' }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="artist" show-overflow-tooltip label="艺术家" v-if="showTableHeader">
            <template #default="scope">
              {{ scope.row.artist || scope.row.singer || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="album" show-overflow-tooltip label="专辑名" v-if="showTableHeader">
            <template #default="scope">
              {{ scope.row.album?.name || scope.row.album || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="duration" align="center" sortable label="歌曲时长" v-if="showTableHeader">
            <template #default="scope">
              {{ scope.row.duration || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="action" align="center" label="操作" :width="showTableHeader ? '78px' : '40px'" v-if="$slots['table-action'] && config.showTableAction">
            <template #default="scope">
              <slot name="table-action" :row="scope.row"></slot>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <Empty></Empty>
          </template>
        </el-table>
      </template>
    </el-skeleton>
    <slot name="pagination"></slot>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-table .el-table__inner-wrapper:before) {
  height: 0;
}
</style>
<script setup>
import { ElMessageBox, tabBarProps } from 'element-plus'
import IconHeart from '@/components/icons/IconHeart.vue'
import IconHeartFill from '@/components/icons/IconHeartFill.vue'
import { usePlayerStore } from '@/stores/player'
import { useCollectStore } from '@/stores/collect'
import { useConfigStore } from '@/stores/config'
import { useRoute } from 'vue-router'
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      info: {},
      tracks: [],
    }),
  },
  tableProps: {
    type: Object,
    default: () => ({}),
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  actionClass: {
    type: String,
    default: '',
  },
  headerClass: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showSkeleton: {
    type: Boolean,
    default: false,
  },
  tableEvents: {
    type: Object,
    default: () => ({}),
  },
})
const route = useRoute()
const playerStore = usePlayerStore()
const collectStore = useCollectStore()
const configStore = useConfigStore()
const slots = defineSlots()
const { play, playData, setPlayData } = playerStore
const config = computed(() => configStore.config)
const playIndex = computed(() => playData.playIndex)
const showTableHeader = computed(() => props.tableProps.showHeader || props.tableProps.showHeader == undefined)
const emit = defineEmits(['action'])
const data = computed(() => props.data)
const tableRef = ref(null)
const tableHeight = ref('calc(100vh - 402px)')
const handlePlayAll = () => {
  ElMessageBox.confirm('此操作会替换播放列表，是否播放？', {
    modalClass: '!z-99999 backdrop-blur',
  })
    .then(() => {
      tableRef.value?.setScrollTop(0)
      setPlayData({ playIndex: 0, playlist: data.value.tracks })
      play(data.value.tracks[0])
    })
    .catch(() => {})
}
const handlePlay = (row) => {
  setPlayData({ playIndex: playData.playlist?.findIndex((item) => item.id == row.id), playlist: [row, ...playData.playlist].filter((item, index, self) => self.findIndex((i) => i.id == item.id) == index) })
  play(row)
}
const toggleCollect = () => {
  if (collectStore.has(data.value.info.id)) collectStore.remove(data.value.info.id)
  else collectStore.add({ ...data.value, tracks: [], type: route.query.type || data.value.type, id: route.params.id || data.value.info.id })
}
watch(playIndex, () => {
  tableRef.value?.setScrollTop(playIndex.value * 40)
})
defineExpose({
  handlePlayAll,
  handlePlay,
  toggleCollect,
  isCollect: (...arg) => collectStore.has(...arg),
  setScrollTop: (val) => tableRef.value?.setScrollTop(val === 0 ? 0 : playIndex.value * 40),
})
const getParentTop = (el) => {
  var actualTop = el.offsetTop
  var current = el.offsetParent
  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent
  }
  return actualTop
}
onMounted(() => {
  nextTick(() => {
    if (tableRef.value === null) return
    let parentTop = getParentTop(tableRef.value.$el)
    tableHeight.value = 'calc(100vh - ' + (parentTop + 100 + (slots.pagination ? 30 : 0)) + 'px)'
    window.addEventListener('resize', () => {
      tableHeight.value = 'calc(100vh - ' + (parentTop + 100 + (slots.pagination ? 30 : 0)) + 'px)'
    })
  })
})
</script>
