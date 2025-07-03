<template>
  <div class="playlist">
    <div class="top min-h-[40px] flex justify-between mb-4">
      <div class="flex items-center">
        <el-popover placement="bottom-start" :disabled="loading" width="560px" trigger="hover">
          <template #reference>
            <span class="cursor-pointer el-dropdown-link">
              {{ ctype || '全部歌单' }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
          </template>
          <el-scrollbar max-height="300px" class="cates w-full">
            <el-row :gutter="20" class="!m-0 !mb-2" v-for="(item, index) in cates" :key="index">
              <el-col :span="24" class="text-xl">
                {{ item.category }}
              </el-col>
              <el-col :span="4" v-for="(el, index) in item.filters" :key="index" class="my-1">
                <el-tag class="cursor-pointer" size="large" @click="fetchListData(el)">{{ el.name }}</el-tag>
              </el-col>
            </el-row>
            <el-empty v-if="!cates.length && !loading" />
          </el-scrollbar>
        </el-popover>
      </div>
      <el-segmented v-model="type" :options="types" :disabled="loading" size="large" :props="{ label: 'title', value: 'type' }" @change="fetchData()" />
    </div>
    <!-- <h1>This is an playlist page</h1> -->
    <el-scrollbar ref="scrollbarRef" max-height="calc(100vh - 260px)" class="flex flex-col min-h-[calc(100vh-260px)]" v-loading="loading">
      <el-row :gutter="10" class="!m-0">
        <el-col v-for="item in playlist" :key="item.id" :span="8" :lg="6" :xl="4" class="mb-10">
          <div class="flex cursor-pointer" @click="router.push({ path: `/playlist/${item.id}`, query: { type: type, ctype, page: currentPage } })">
            <div class="img">
              <el-image lazy class="rounded-md overflow-hidden w-[140px] h-[140px]" fit="fill" :src="item.cover_img_url"></el-image>
            </div>
            <div class="info flex flex-col ml-2">
              <el-text>{{ item.title }}</el-text>
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
import { onMounted, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

defineOptions({ name: 'playlist' })
const route = useRoute()
const router = useRouter()
const type = ref(route.query.type || 'qq')
const ctype = ref(route.query.ctype || '')
const types = ref([])
const cates = ref([{ id: '', category: '推荐', filters: [] }])
const playlist = ref([])
const loading = ref(true)
const total = ref(0)
const hasNextPage = ref(false)
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)
const scrollbarRef = ref(null)

const fetchData = (el) => {
  const current = el || types.value.find((el) => el.type == type.value)
  loading.value = true
  currentPage.value = 1
  fetchCatesData(current)
  fetchListData(current)
}
const fetchCateData = async () => {
  loading.value = true
  const response = await fetch('https://api.boycot.top/api/music/cate')
  let res = await response.json()
  types.value = res.data.map((el) => ({ ...el, title: el.title + '音乐' }))
}
const fetchCatesData = (item = { type: type.value }) => {
  ctype.value = ''
  fetch('https://api.boycot.top/api/music/cate?type=' + item.type)
    .then((res) => res.json())
    .then((res) => {
      if (!res.data) {
        cates.value = []
        return
      }
      cates.value = [{ ...cates.value[0], filters: res.data.recommend }, ...res.data.all]
      scrollbarRef.value?.setScrollTop(0)
    })
}
const fetchListData = (item = {}) => {
  if (typeof item === 'number') {
    currentPage.value = item
    item = {}
  }
  ctype.value = item.id || ctype.value
  loading.value = true
  fetch(`https://api.boycot.top/api/music?type=${item.type || type.value}&offset=${currentPage.value}&id=${ctype.value}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res, type.value)
      loading.value = false
      scrollbarRef.value?.setScrollTop(0)
      if (!res.data) return
      total.value = res.data.total || 999
      if (currentPage.value) playlist.value = res.data.result
      hasNextPage.value = !!res.data.hasNextPage
      //   else playlist.value = [...playlist.value, ...res.data.result]
    })
    .catch(() => {
      loading.value = false
    })
}
onMounted(() => {
  fetchCateData()
  fetchListData()
})
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
