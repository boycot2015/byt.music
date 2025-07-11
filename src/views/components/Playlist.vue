<template>
  <div class="playlist-detail !overflow-hidden">
    <slot name="action">
      <div class="actions backdrop-blur-md text-right absolute top-20 right-0" :class="actionClass" v-if="showActions && data.info">
        <el-button type="primary" @click="handlePlayAll" :disabled="!data.info.id"
          ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
        >
        <el-button type="warning" @click="toggleCollect" :disabled="!data.info.id"
          ><el-icon class="mr-2"><IconHeartFill v-if="collectStore.has(data.info.id)" /> <IconHeart v-else /></el-icon> {{ collectStore.has(data.info.id) ? '已' : '' }}收藏</el-button
        >
        <el-link :href="data.info.source_url" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3">
          <el-button :disabled="!data.info.id"
            ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
          >
        </el-link>
      </div>
    </slot>
    <slot name="header"></slot>
    <el-table ref="tableRef" v-if="data.tracks" :row-class-name="({ row, rowIndex }) => (playData.id == row.id ? 'current-row' : '')" v-bind="tableProps" :data="data.tracks" @row-dblclick="handlePlay">
      <el-table-column prop="title" label="歌曲名称" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.title }}
          <span v-if="scope.row.quality == 'HQ'" class="text-[green] text-[12px]">{{ scope.row.quality }}</span>
          <span v-else class="text-[purple] text-[12px]">{{ scope.row.quality }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="artist" show-overflow-tooltip label="艺术家"></el-table-column>
      <el-table-column prop="album" show-overflow-tooltip label="专辑名称">
        <template #default="scope">
          {{ scope.row.album?.name || scope.row.album || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="duration" sortable width="120px" label="歌曲时长"></el-table-column>
      <template v-slot:empty>
        <el-empty></el-empty>
      </template>
    </el-table>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { VideoPlay, Link } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import IconHeart from '@/components/icons/IconHeart.vue'
import IconHeartFill from '@/components/icons/IconHeartFill.vue'
import { usePlayerStore } from '@/stores/player'
import { useCollectStore } from '@/stores/collect'
import { useRoute } from 'vue-router'
const route = useRoute()
const playerStore = usePlayerStore()
const collectStore = useCollectStore()

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
  actionClass: {
    type: String,
    default: '',
  },
})
const { play, playData, setPlayData } = playerStore
const playIndex = computed(() => playData.playIndex)

const data = computed(() => props.data)
const tableRef = ref(null)

const handlePlayAll = () => {
  ElMessageBox.confirm('此操作会替换播放列表，是否播放？')
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
  else collectStore.add({ ...data.value, tracks: [], type: route.query.type, id: route.params.id })
}
watch(playIndex, () => {
  tableRef.value?.setScrollTop(playIndex.value * 40)
})
defineExpose({
  handlePlayAll,
  handlePlay,
  toggleCollect,
  setScrollTop: (val) => tableRef.value?.setScrollTop(val === 0 ? 0 : playIndex.value * 40),
})
</script>
<style></style>
