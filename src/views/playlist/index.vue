<template>
  <div class="playlist">
    <div class="top min-h-[40px] flex justify-between mb-4">
      <div class="flex items-center">
        <el-popover placement="bottom-start" :disabled="cateLoading || (cates[type] && !cates[type].length)" width="560px" trigger="hover">
          <template #reference>
            <span class="cursor-pointer el-dropdown-link flex items-center">
              {{ ctypeObj.name || '全部歌单' }}
              <el-icon class="el-icon--right">
                <arrow-down v-if="cates[type] && cates[type].length" />
                <Loading v-else-if="cateLoading" />
              </el-icon>
            </span>
          </template>
          <el-scrollbar max-height="300px" class="cates w-full">
            <el-row :gutter="20" class="!m-0 !mb-2" v-for="(item, index) in cates[type]" :key="index">
              <el-col :span="24" class="text-xl">
                {{ item.category }}
              </el-col>
              <el-col :span="4" v-for="(el, index) in item.filters" :key="index" class="my-1">
                <el-tag
                  class="cursor-pointer"
                  size="large"
                  @click="
                    () => {
                      ctypeObj = el
                      fetchListData(el)
                    }
                  "
                  :type="ctypeObj.name == el.name ? 'danger' : 'primary'"
                  >{{ el.name }}</el-tag
                >
              </el-col>
            </el-row>
            <el-empty v-if="cates[type] && !cates[type].length && !loading" />
          </el-scrollbar>
        </el-popover>
      </div>
      <el-segmented v-model="type" :options="types" :disabled="loading" size="large" :props="{ label: 'title', value: 'type' }" @change="fetchData" />
    </div>
    <!-- <h1>This is an playlist page</h1> -->
    <el-scrollbar ref="scrollbarRef" max-height="calc(100vh - 260px)" class="flex flex-col min-h-[calc(100vh-260px)]" v-loading="loading">
      <el-row :gutter="10" class="!m-0">
        <el-col v-for="item in playlist" :key="item.id" :span="8" :lg="6" :xl="4" class="mb-10">
          <div class="flex cursor-pointer" @click="router.push({ path: `/playlist/${item.id}`, query: { type: type, ctype, page: currentPage } })">
            <div class="img">
              <el-image lazy class="rounded-md overflow-hidden w-[140px] h-[140px]" fit="fill" :src="item.cover_img_url"></el-image>
            </div>
            <div class="info flex flex-col ml-2 gap-y-2">
              <div class="text-[#333] line-clamp-2">{{ item.title }}</div>
              <div class="text-[#666] text-sm line-clamp-1 flex items-center"><el-avatar class="mr-1" v-if="item.creator?.avatarUrl" :src="item.creator?.avatarUrl" size="small"></el-avatar> {{ item.creator?.name || item.creator?.nickname }}</div>
              <div>{{ item.create_time }}</div>
              <div class="text-[#666] text-sm line-clamp-1">{{ item.play_num ? (item.play_num > 10000 ? (item.play_num / 10000).toFixed(1) + '万次播放' : item.play_num + '次播放') : '' }}</div>
            </div>
          </div>
        </el-col>
        <el-col v-if="!loading && !playlist.length">
          <el-empty></el-empty>
        </el-col>
      </el-row>
    </el-scrollbar>
    <div class="flex justify-end mt-2">
      <el-pagination layout="total, prev, pager, next, jumper, ->" :total="total" v-model:current-page="currentPage" @current-change="fetchListData" />
    </div>
  </div>
</template>
<script name="playlist" setup>
import { getCurrentInstance, ref } from 'vue'
import { ArrowDown, Loading } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
defineOptions({ name: 'playlist' })
const route = useRoute()
const router = useRouter()
const type = ref(route.query.type || 'qq')
const ctype = ref(route.query.ctype || '')
const types = ref([])
const cates = ref({})
const playlist = ref([])
const loading = ref(true)
const cateLoading = ref(false)
const total = ref(0)
const hasNextPage = ref(false)
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)
const scrollbarRef = ref(null)
const ctypeObj = ref({})
const fetchData = (el) => {
  const current = el ? { type: el } : types.value.find((el) => el.type == type.value)
  loading.value = true
  currentPage.value = 1
  ctype.value = !el ? route.query.ctype || '' : ''
  fetchCatesData(current)
  fetchListData(current)
}
const fetchCateData = async () => {
  loading.value = true
  const response = await fetch(`${$apiUrl}/music/cate`).then((res) => res.json())
  types.value = response.data.map((el) => ({ ...el, title: el.title + '音乐' }))
}
const fetchCatesData = (item = { type: type.value }) => {
  if (cates.value[type.value] && cates.value[type.value].length) {
    ctypeObj.value = cates.value[type.value][0]?.filters[0]
    return
  }
  cateLoading.value = true
  fetch(`${$apiUrl}/music/cate?type=${item.type}`)
    .then((res) => res.json())
    .then((res) => {
      if (!res.data) {
        cates.value[type.value] = []
        cateLoading.value = false
        return
      }
      cates.value[type.value] = [{ ...cates.value[0], filters: res.data.recommend }, ...res.data.all]
      cates.value[type.value].some((val) => {
        let current = val.filters.find((el) => el.id == ctype.value)
        if (current) {
          ctypeObj.value = current
          return true
        }
      })
      scrollbarRef.value?.setScrollTop(0)
      cateLoading.value = false
    })
}
const fetchListData = (item = {}) => {
  if (typeof item === 'number') {
    currentPage.value = item
    item = {}
  }
  ctype.value = item.id || ctype.value
  loading.value = true
  fetch(`${$apiUrl}/music?type=${item.type || type.value}&offset=${currentPage.value - 1}&id=${ctype.value}`)
    .then((res) => res.json())
    .then((res) => {
      loading.value = false
      scrollbarRef.value?.setScrollTop(0)
      if (!res.data) return
      total.value = res.data.total || 999
      if (currentPage.value) playlist.value = res.data.result
      hasNextPage.value = !!res.data.hasNextPage
    })
    .catch(() => {})
}
fetchCateData()
fetchData()
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 50vh;
    display: flex;
    align-items: center;
  }
}
</style>
