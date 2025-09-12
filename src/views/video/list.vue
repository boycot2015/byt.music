<template>
  <div class="tab-content tab-cate-content tab-singer-content md:mr-1">
    <el-skeleton :loading="pageLoading" animated>
      <template #template>
        <el-row class="grid-list flex flex-wrap overflow-hidden rounded-md md:mb-2" :gutter="10">
          <el-col v-for="item in 12" :span="12" :sm="8" :md="6" :xl="4" :item="item" :key="item">
            <div class="flex flex-col w-full mb-2">
              <el-skeleton-item variant="image" class="!rounded w-full !h-[100px] md:!h-[160px]" />
              <div class="mt-2">
                <el-skeleton-item variant="text" style="width: 100%" />
                <el-skeleton-item variant="text" style="width: 60%" />
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template #default>
        <el-row class="grid-list flex flex-wrap overflow-hidden rounded-md md:mb-2" :gutter="10">
          <grid-list v-for="item in tabData[type] || []" :item="item" @click.stop="onListClick(item)" :key="item.id"></grid-list>
          <el-col :span="24" v-if="loading">
            <div class="flex justify-center items-center w-full">
              <el-button loading link loading-icon="Loading"></el-button>
              <span class="ml-2">数据加载中...</span>
            </div>
          </el-col>
        </el-row>
      </template>
    </el-skeleton>
  </div>
</template>
<style lang="scss" scoped>
.cates-item {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  &.active {
    color: var(--el-color-primary);
  }
}
</style>
<script setup>
import { useVideoStore } from '@/stores/video'
import { useConfigStore } from '@/stores/config'
import { useRoute } from 'vue-router'
import GridList from './components/GridList.vue'
import { onMounted } from 'vue'

const pageLoading = ref(true)
const loading = ref(false)
const videoStore = useVideoStore()
const { config, scrollRef } = useConfigStore()
const route = useRoute()
const offset = ref(1)
const limit = ref(16)
const type = route.params.id
const query = route.query
const tabData = ref(Object.assign({}, videoStore.tab2Data))
const hasMore = ref(true)
const reachedEnd = computed(() => config.reachedEnd)
watch(reachedEnd, (val) => {
  if (val && !loading.value && hasMore.value) {
    loading.value = true
    videoStore
      .getVideoByParams({
        type,
        ctype: query.category,
        offset: offset.value,
        limit: limit.value,
        area: query.area,
      })
      .then(({ data = [] }) => {
        loading.value = false
        tabData.value[type] = [...tabData.value[type], ...data]
        hasMore.value = data.length >= limit.value
        if (!hasMore.value) return
        offset.value++
      })
  }
})
const onListClick = (item) => {
  videoStore.setVideoPlayer({
    ...item,
    id: item.id || item.vid || item.mvid,
    type: 'mv',
    cover: item.cover,
  })
  videoStore.setVideoPlayerShow(true)
}
onMounted(() => {
  pageLoading.value = false
  offset.value = 1
  scrollRef?.setScrollTop(0)
})
</script>
