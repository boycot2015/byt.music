<template>
  <div class="grid-list rounded overflow-hidden">
    <el-scrollbar ref="scrollbarRef" :height="config.isMobile ? 'auto' : height || 'calc(100vh - 240px)'" :class="`flex flex-col ${height && !config.isMobile ? '' : 'min-h-[calc(100vh-240px)]'} rounded-md`" @end-reached="(val) => val == 'bottom' && emit('end-reached')">
      <el-row :gutter="10" class="!m-0">
        <el-col v-for="item in playlist" :key="item.id" :span="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb-3 last:mb-0 md:mb-5">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <div class="!flex w-full">
                <el-skeleton-item variant="image" class="!rounded" style="width: 140px; height: 140px" />
                <div class="flex-1 ml-2">
                  <el-skeleton-item variant="h3" style="width: 50%" />
                  <div style="margin-top: 10px; height: 16px">
                    <el-skeleton-item v-for="item in 3" :key="item" variant="text" style="width: 100%" />
                    <el-skeleton-item variant="text" style="width: 30%" />
                  </div>
                </div>
              </div>
            </template>
            <template #default>
              <div class="flex cursor-pointer relative" @click="router.push({ path: `/playlist/${item.id}`, query: { type: item.type || type, ctype, page: currentPage } })">
                <div class="img">
                  <Image lazy class="rounded-md overflow-hidden w-[140px] h-[140px]" fit="fill" :src="item.cover_img_url" :size="140"></Image>
                </div>
                <div class="info flex flex-col ml-2 gap-y-2 flex-1">
                  <div class="text-[var(--color-text)] line-clamp-2">{{ item.title || '--' }}</div>
                  <div class="text-[var(--color-text-secondary)] text-sm line-clamp-1 flex items-center">
                    <el-avatar class="mr-1" v-if="item.creator?.avatarUrl" :src="item.creator?.avatarUrl" size="small"></el-avatar>
                    <span class="line-clamp-1 flex-1 max-w-[140px]" v-html="(item.creator?.nickname || item?.desc || '').replace(/<br>/g, '')"></span>
                  </div>
                  <div v-if="item.create_time || item.ctime || item.createTime">{{ new Date(item.create_time || item.ctime || item.createTime).toLocaleString().replace(/\//g, '-').split(' ')[0] }}</div>
                  <div class="flex justify-between items-center text-sm w-full">
                    <div class="line-clamp-1" v-if="item.type">来源：{{ config.types.find((type) => type.type === item.type)?.title }}</div>
                    <div class="text-[var(--color-text-secondary)] line-clamp-1 flex items-center" v-if="item.play_count">
                      <el-icon class="mr-1"> <Headset /> </el-icon>{{ filterPlayCount(item.play_count, 1) + '次播放' }}
                    </div>
                  </div>
                  <slot name="action" :row="item"></slot>
                </div>
              </div>
            </template>
          </el-skeleton>
        </el-col>
      </el-row>
      <Empty v-if="!loading && !playlist.length"></Empty>
    </el-scrollbar>
    <slot name="pagination"> </slot>
  </div>
</template>

<script name="GridList" setup>
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { filterPlayCount } from '@/utils'
const { config, setScrollRef } = useConfigStore()
const scrollbarRef = ref(null)
const router = useRouter()
const emit = defineEmits(['end-reached'])
defineProps({
  loading: {
    type: Boolean,
    default: true,
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
    if (config.isMobile) {
      scrollbarRef.value = useConfigStore().scrollRef
      scrollbarRef.value?.setScrollTop(top || 0)
      return
    }
    scrollbarRef.value?.setScrollTop(top || 0)
  },
})
</script>

<style>
</style>