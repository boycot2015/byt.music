<template>
  <div class="favorites h-full !p-0 min-h-[300px]">
    <el-row :gutter="10" class="overflow-hidden flex flex-col md:flex-row">
      <el-col :span="24" :sm="6" :md="4">
        <el-scrollbar style="height: calc(100vh - 160px)" class="hidden md:block ml-[-20px] md:border-r md:border-[var(--el-menu-border-color)]">
          <el-menu :default-active="current" class="h-[calc(100vh-210px)] !border-0 !hidden md:!block" @select="onSelect" v-if="collect[current]">
            <el-menu-item v-for="(item, index) in collect" :key="item.info?.id || index" :index="index + ''" @mouseenter="collectStore.update({ ...item, showClose: true })" @mouseleave="collectStore.update({ ...item, showClose: false })">
              <div class="flex items-center">
                <Image class="basis-[32px] rounded" lazy v-if="item.info.cover_img_url" :src="item.info.cover_img_url"></Image>
                <el-icon :size="42" v-else><IconMusic /></el-icon>
                <div class="flex-1 ml-2">
                  <div class="text-xs line-clamp-2 text-wrap pr-[10px]" v-html="item.info.title"></div>
                </div>
                <div v-if="!!item.info.id" class="close cursor-pointer hover:text-[var(--el-color-primary)] absolute right-2 transition-colors duration-300 ease-in-out" :class="{ hidden: !item.showClose }">
                  <el-icon @click.stop="collectStore.remove(item.info.id)"><Delete /></el-icon>
                </div>
              </div>
            </el-menu-item>
          </el-menu>
          <Empty v-if="!collect[current]" />
        </el-scrollbar>
        <GridList height="calc(100vh - 140px)" class="overflow-hidden pr-0 md:!hidden" :loading="loading" :playlist="collect.map((el) => ({ ...el.info, id: el.id || el.info.id, type: el.type }))" ref="gridRef">
          <template #action="{ row }">
            <div v-if="!!row.id" class="close text-[var(--el-color-primary)] cursor-pointer hover:text-[var(--el-color-primary)] absolute bottom-16 right-2 transition-colors duration-300 ease-in-out">
              <el-icon @click.stop="collectStore.remove(row.id)"><Delete /></el-icon>
            </div>
          </template>
        </GridList>
      </el-col>
      <el-col :span="0" :sm="18" :md="20">
        <Playlist ref="playlistRef" class="rounded-md" :loading="loading" :data="{ ...collect[current], tracks: playlist }" :tableProps="{ height: 'calc(100vh - 190px)' }">
          <template #action>
            <div class="flex justify-between items-center mb-[10px]" v-if="collect[current]?.info">
              <div class="text-right">
                <el-button type="primary" :disabled="!collect[current] || loading || playlist.length == 0" @click="() => playlistRef.handlePlayAll()"
                  ><el-icon class="mr-2"><VideoPlay /></el-icon> 播放</el-button
                >
                <el-link v-if="collect[current]?.info?.source_url" :href="collect[current]?.info?.source_url" underline="never" target="_blank" rel="noopener noreferrer" class="text-[#444] ml-3">
                  <el-button :disabled="!collect[current] || loading"
                    ><el-icon class="mr-2"><Link /></el-icon> 官源</el-button
                  >
                </el-link>
                <el-button
                  type="danger"
                  @click="
                    () => {
                      ElMessageBox.confirm('确定清空？').then(() => {
                        collect[current] && collect[current].info.id == 0 && (playlist = [])
                        collectStore.remove(0, 'song')
                      })
                    }
                  "
                  v-if="collect[current]?.info?.id == 0"
                  :disabled="!collect[current] || loading"
                  ><el-icon class="mr-2"><Delete /></el-icon> 清空</el-button
                >
              </div>
            </div>
          </template>
          <template #table-action="scope">
            <el-link type="primary" size="small" @click="() => playlistRef.handlePlay(scope.row)"
              ><el-icon :size="22"> <icon-play /> </el-icon
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
                          collect[current] && collect[current].info.id == 0 && (playlist = playlist.filter((item) => item.id !== scope.row.id))
                          collectStore.toggleCollect(scope.row, 'song')
                        })
                        .catch(() => {})
                    : collectStore.toggleCollect(scope.row, 'song')
                }
              "
            >
              <el-icon>
                <Delete v-if="collect[current] && collect[current].info.id == 0" />
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
<script name="favorites" setup>
import { useCollectStore } from '@/stores/collect'
import { ElMessageBox } from 'element-plus'
import Playlist from '@/views/components/Playlist.vue'
import GridList from '@/views/components/GridList.vue'
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const collectStore = useCollectStore()
const collect = computed(() => collectStore.collect)
const current = computed(() => collectStore.current)
const playlistRef = ref(null)
const playlist = ref([])
const loading = ref(false)
const onSelect = (index) => {
  loading.value = true
  playlistRef.value?.setScrollTop(0)
  collectStore.setCurrent(index)
  fetchData()
}
const fetchData = async (refresh) => {
  if (!collect.value[current.value] || !collect.value[current.value].info.id) {
    playlist.value = collect.value[current.value]?.tracks || []
    loading.value = false
    return
  }
  loading.value = !!refresh
  const response = await fetch(`${$apiUrl}/music/detail?type=${collect.value[current.value].type}&id=${collect.value[current.value]?.id}`)
  let res = await response.json()
  loading.value = false
  playlist.value = res.data.tracks || []
}
fetchData(true)
onActivated(() => {
  fetchData(false)
})
</script>
<style></style>
