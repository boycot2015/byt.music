<template>
  <div class="grid-list rounded overflow-hidden">
    <el-scrollbar ref="scrollbarRef" :height="config.isMobile ? 'auto' : height || 'calc(100vh - 240px)'" class="flex flex-col min-h-[calc(100vh-240px)] rounded-md" v-loading="loading">
      <el-row :gutter="10" class="!m-0">
        <el-col v-for="item in playlist" :key="item.id" :span="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb-3 last:mb-0 md:mb-5">
          <div class="flex cursor-pointer relative" @click="router.push({ path: `/playlist/${item.id}`, query: { type: type, ctype, page: currentPage } })">
            <div class="img">
              <Image lazy class="rounded-md overflow-hidden w-[140px] h-[140px]" fit="fill" :src="item.cover_img_url" :size="140"></Image>
            </div>
            <div class="info flex flex-col ml-2 gap-y-2">
              <div class="text-[var(--color-text)] line-clamp-2">{{ item.title || '--' }}</div>
              <div class="text-[var(--color-text-secondary)] text-sm line-clamp-1 flex items-center">
                <el-avatar class="mr-1" v-if="item.creator?.avatarUrl" :src="item.creator?.avatarUrl" size="small"></el-avatar>
                <span class="line-clamp-1 flex-1">{{ item.creator?.nickname || item?.desc }}</span>
              </div>
              <div>{{ item.create_time }}</div>
              <div class="text-[var(--color-text-secondary)] text-sm line-clamp-1">{{ item.play_count ? (item.play_count > 10000 ? (item.play_count / 10000).toFixed(1) + '万次播放' : item.play_count + '次播放') : '' }}</div>
            </div>
            <slot name="action" :row="item"></slot>
          </div>
        </el-col>
      </el-row>
      <Empty v-if="!loading && !playlist.length"></Empty>
    </el-scrollbar>
    <slot name="pagination"> </slot>
  </div>
</template>

<script name="GridList" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'
const { config } = useConfigStore()
const scrollbarRef = ref(null)
const router = useRouter()
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  playlist: {
    type: Array,
    default: () => [],
  },
  height: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'qq',
  },
  ctype: {
    type: [String, Number],
    default: '',
  },
})
defineExpose({
  setScrollTop: (top) => {
    scrollbarRef.value.setScrollTop(top)
  },
})
</script>

<style>
</style>