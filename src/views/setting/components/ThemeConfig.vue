<template>
  <div class="theme-config w-full">
    <div class="theme-config-title mb-2 h-[32px] leading-[32px] flex items-center justify-between">
      <div class="left flex items-center">
        <div class="h-[16px] flex items-center justify-between border-l border-l-3 pr-2 border-[var(--el-color-primary)]"></div>
        主题色
      </div>
      <span class="flex items-center">
        来源：
        <el-link type="primary" target="_blank" :href="colorSource"
          ><el-icon class="mr-2"><Link /></el-icon>中国色</el-link
        >
      </span>
    </div>
    <el-row v-loading="colorLoading" class="min-h-[200px] rounded-md overflow-hidden">
      <el-col v-for="(item, index) in showColors" :key="index" :span="2">
        <div class="flex flex-col items-center justify-center ml-[-20px]">
          <el-color-picker size="large" v-model="item.value" :predefine="colors.map((el) => el.value).slice(index * 16, index * 16 + 16)" @change="onPickerChange" />
          <div class="text-md">{{ item.name }}</div>
        </div>
      </el-col>
    </el-row>
    <div class="theme-config-title mb-2 mt-5 h-[32px] leading-[32px] flex items-center justify-between">
      <div class="left flex items-center">
        <div class="h-[16px] flex items-center justify-between border-l border-l-3 pr-2 border-[var(--el-color-primary)]"></div>
        主题背景
      </div>
      <div class="source">
        <div class="flex items-center justify-center">
          <el-segmented
            v-model="picType"
            :options="picSources"
            :disabled="picLoading"
            size="large"
            :props="{ label: 'label', value: 'value' }"
            @change="
              () => {
                picPage = 1
                picCate = ''
                scrollbarRef.setScrollTop(0)
                fetchPicData()
              }
            "
          />
        </div>
      </div>
    </div>
    <el-tabs v-model="picCate" class="mb-2" @tab-click="onPicCateChange">
      <el-tab-pane v-for="(item, index) in picCates" :disabled="picLoading" :key="index" :label="item.name" :name="item.id + ''" />
    </el-tabs>
    <el-scrollbar
      height="490px"
      ref="scrollbarRef"
      class="rounded-md"
      v-loading="picLoading"
      @end-reached="
        (direction) => {
          if (direction === 'bottom') {
            picPage++
            fetchPicData(picPage)
          }
        }
      "
    >
      <el-row class="flex items-center" :gutter="10">
        <el-col v-for="(item, index) in picList" :key="index" :span="12" :lg="6" :md="8" :xl="4">
          <Image
            class="rounded cursor-pointer border border-2 border-[transparent]"
            :class="{ 'border-[var(--el-color-primary)]': item.id === active }"
            :src="item.url"
            lazy
            @click="
              () => {
                active = item.id + ''
                set({ theme: { ...config.theme, backgroundImage: item.url } })
              }
            "
          >
          </Image>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, nextTick } from 'vue'
import { useConfigStore } from '@/stores/config'
import { setHtmlStyleProp } from '@/utils'
const { config, set } = useConfigStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const colors = ref([])
const colorLoading = ref(false)

// 图片列表
const picList = ref([])
const picCates = ref([])
const picSources = ref([])
const picTotal = ref(0)
const picType = ref('birdpaper')
const picCate = ref('')
const picPage = ref(1)
const picLoading = ref(false)
const active = ref('0')
const scrollbarRef = ref(null)

const showColors = ref([])
const colorSource = ref('https://zhongguose.com')
const fetchData = async () => {
  colorLoading.value = true
  const target = colorSource.value + '/colors.json'
  fetch(`${$apiUrl}/cors?url=${target}`, {})
    .then((res) => res.json())
    .then((res) => {
      colors.value = res.data?.map((el, index) => {
        el.value = el.hex
        if (index % 16 === 0) {
          showColors.value.push(el)
        }
        return el
      })
      colorLoading.value = false
    })
  fetchPicData()
}
const fetchPicData = async (page = 1) => {
  picLoading.value = true
  const target = `${$apiUrl}/wallpaper?source=${picType.value}&id=${picCate.value}&page=${picPage.value || page}&size=16`
  fetch(target, {})
    .then((res) => res.json())
    .then((res) => {
      picTotal.value = res.data?.total_count || 0
      picCates.value = res.data?.cates || []
      picSources.value = res.data?.source.filter((el) => el.value != 'default') || []
      picCate.value = picCate.value || res.data?.cates?.[0]?.id || '0'
      picList.value = page > 1 ? [...picList.value, ...(res.data?.list || [])] : res.data?.list
      nextTick(() => {
        picLoading.value = false
      })
    })
    .catch(() => {
      picLoading.value = false
    })
}
const onPickerChange = (val) => {
  setHtmlStyleProp(val)
  set({
    theme: {
      ...config.theme,
      primaryColor: val,
    },
  })
}
const onPicCateChange = () => {
  nextTick(() => {
    picPage.value = 1
    scrollbarRef.value.setScrollTop(0)
    fetchPicData()
  })
}
fetchData()
</script>

<style></style>
