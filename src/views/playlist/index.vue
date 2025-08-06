<template>
  <div class="playlist">
    <div class="top min-h-[40px] flex justify-between md:mb-4">
      <div class="flex items-center">
        <el-popover placement="bottom-start" :show-arrow="false" v-model:visible="modalVisible" popper-class="!w-[95vw] backdrop-blur md:!w-[600px] !p-2 !pl-0" :disabled="cateLoading || (cates[type] && !cates[type].length)" :trigger="config.isMobile ? 'click' : 'hover'">
          <template #reference>
            <span class="cursor-pointer el-dropdown-link flex items-center">
              {{ ctypeObj.name || '全部歌单' }}
              <el-icon class="el-icon--right">
                <arrow-down v-if="cates[type] && cates[type].length" />
                <el-button loading v-else-if="cateLoading" type="primary" link loading-icon="Loading" class="ml-2"></el-button>
              </el-icon>
            </span>
          </template>
          <el-scrollbar max-height="300px" class="cates md:w-full">
            <el-row :gutter="20" class="!m-0 !mb-2" v-for="(item, index) in cates[type]" :key="index">
              <el-col :span="24" class="text-xl">
                {{ item.category || item.name }}
              </el-col>
              <el-col :span="6" :md="4" v-for="(el, index) in item.filters.filter((el) => el.name != '排行榜')" :key="index" class="my-1">
                <el-tag
                  class="cursor-pointer"
                  size="large"
                  @click.stop="
                    () => {
                      ctypeObj = el
                      currentPage = 1
                      gridRef.setScrollTop(0)
                      fetchListData(el)
                      modalVisible = false
                    }
                  "
                  :effect="ctypeObj.name != el.name ? 'light' : 'dark'"
                  :type="ctypeObj.name == el.name ? 'danger' : 'primary'"
                  >{{ el.name }}</el-tag
                >
              </el-col>
            </el-row>
            <Empty v-if="cates[type] && !cates[type].length && !loading" />
          </el-scrollbar>
        </el-popover>
      </div>
      <div class="hidden md:block">
        <el-segmented
          v-model="type"
          :options="types"
          :disabled="loading"
          size="large"
          :props="{ label: 'title', value: 'type' }"
          @change="
            () => {
              ctypeObj = {}
              currentPage = 1
              gridRef.setScrollTop(0)
              fetchData()
            }
          "
        />
      </div>
      <div class="block md:hidden flex items-center">
        <el-dropdown
          trigger="click"
          :show-arrow="false"
          popper-class="backdrop-blur"
          @command="
            () => {
              ctypeObj = {}
              currentPage = 1
              gridRef.setScrollTop(0)
              fetchData()
            }
          "
        >
          <span class="el-dropdown-link flex items-center">
            {{ types.find((el) => el.type == type).title }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in types" :key="item.type" @click="type = item.type">{{ item.title }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <GridList v-loading="loading" :playlist="playlist" :type="type" :ctype="ctype" ref="gridRef">
      <template #pagination>
        <div class="flex justify-center md:justify-end mt-2">
          <el-pagination class="!hidden md:!flex" layout="total, prev, pager, next, jumper, ->" :total="total" v-model:current-page="currentPage" @current-change="fetchListData" />
          <el-pagination class="!flex md:!hidden" layout="total, prev, next, jumper, ->" :total="total" v-model:current-page="currentPage" @current-change="fetchListData" />
        </div>
      </template>
    </GridList>
  </div>
</template>
<script name="playlist" setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import GridList from '@/views/components/GridList.vue'
defineOptions({ name: 'playlist' })
const { config } = useConfigStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const route = useRoute()
const type = ref(route.query.type || 'qq')
const ctype = ref(route.query.ctype || '')
const types = computed(() => config.types)
const cates = ref({})
const playlist = ref([])
const loading = ref(true)
const cateLoading = ref(false)
const modalVisible = ref(false)
const total = ref(0)
const hasNextPage = ref(false)
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)
const gridRef = ref(null)
const ctypeObj = ref({})
const fetchData = (el) => {
  const current = el ? { type: el } : types.value.find((el) => el.type == type.value)
  loading.value = true
  currentPage.value = 1
  ctype.value = !el ? route.query.ctype || '' : ''
  fetchCatesData(current)
  fetchListData(current)
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
      cates.value[type.value] = [{ category: '热门', id: '', filters: res.data.recommend }, ...res.data.all]
      cates.value[type.value].some((val) => {
        let current = val.filters.find((el) => el.id == ctype.value)
        if (current) {
          ctypeObj.value = current
          return true
        }
      })
      gridRef.value?.setScrollTop(0)
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
  fetch(`${$apiUrl}/music?type=${item.type || type.value}&offset=${currentPage.value - 1}&limit=12&id=${ctype.value}`)
    .then((res) => res.json())
    .then((res) => {
      loading.value = false
      gridRef.value?.setScrollTop(0)
      if (!res.data) return
      total.value = res.data.total || 999
      if (currentPage.value) playlist.value = res.data.result
      hasNextPage.value = !!res.data.hasNextPage
    })
    .catch(() => {})
}
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
