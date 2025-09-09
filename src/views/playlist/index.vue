<template>
  <div class="playlist h-[calc(100vh-300px)]">
    <div class="banner md:px-2">
      <el-skeleton :loading="bannerLoading" animated class="w-full h-[20vh] md:h-[36vh]">
        <template #template>
          <el-carousel ref="bannerCarousel" :height="config.isMobile ? '20vh' : '36vh'" :indicator-position="!config.isMobile ? '' : 'none'" :interval="4000" :type="!config.isMobile ? 'card' : ''" arrow="hover">
            <el-carousel-item v-for="item in 6" :key="item">
              <el-skeleton-item variant="image" class="!h-[20vh] md:!h-[36vh] !rounded-lg"></el-skeleton-item>
            </el-carousel-item>
          </el-carousel>
        </template>
        <template #default>
          <el-carousel :key="config.isMobile ? 'mobile' : 'desktop'" :pause-on-hover="false" ref="bannerCarousel" :height="config.isMobile ? '20vh' : '36vh'" :indicator-position="!config.isMobile ? '' : 'none'" :interval="4000" :type="!config.isMobile ? 'card' : ''" arrow="hover">
            <el-carousel-item v-for="(item, index) in banner" :key="index">
              <div @click="(e) => bannerCarousel && bannerCarousel.activeIndex == index && handleBannerClick(e, item)" class="relative">
                <el-image lazy v-if="config.isMobile" :src="item.imageUrl" alt="" class="rounded-lg h-[20vh] w-full" fit="cover" />
                <el-image v-else lazy :src="item.imageUrl" alt="" class="rounded-lg h-[35vh] w-full" fit="cover" />
                <el-tag class="absolute right-0 bottom-1.5 md:bottom-8" v-if="item.typeTitle">{{ item.typeTitle }}</el-tag>
              </div>
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-skeleton>
    </div>
    <div class="top min-h-[40px] flex items-center justify-between md:mb-4">
      <div class="flex order-2 items-center" v-if="!config.isMobile">
        <el-popover placement="bottom-start" :show-arrow="false" v-model:visible="modalVisible" popper-class="!w-[95vw] backdrop-blur md:!w-[600px] !p-2 !pl-0" :disabled="cateLoading || (cates[type] && !cates[type].length)">
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
      <span class="flex items-center order-2" v-else @click="modalVisible = true">
        {{ ctypeObj.name || '全部歌单' }}
        <el-button loading v-if="cateLoading" type="primary" link loading-icon="Loading" class="ml-2"></el-button>
        <el-icon class="ml-2" v-else><Menu /></el-icon>
      </span>
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
    <GridList :loading="loading" :height="'calc(100vh - 36vh - 235px)'" :playlist="playlist" :type="type" :ctype="ctype" ref="gridRef">
      <template #pagination>
        <div class="flex justify-center md:justify-end my-2">
          <el-pagination class="!hidden md:!flex" layout="total, prev, pager, next, jumper, ->" :total="total" v-model:current-page="currentPage" @current-change="fetchListData" />
          <el-pagination class="!flex md:!hidden" layout="total, prev, next, jumper, ->" :total="total" v-model:current-page="currentPage" @current-change="fetchListData" />
        </div>
      </template>
    </GridList>
    <el-drawer :with-header="false" v-if="config.isMobile" v-model="modalVisible" size="88%" body-class="!p-2" modal-class="backdrop-blur" append-to-body>
      <el-scrollbar max-height="100%" class="cates md:w-full">
        <el-row :gutter="20" class="!m-0 !mb-2" v-for="(item, index) in cates[type]" :key="index">
          <el-col :span="24" class="text-xl">
            {{ item.category || item.name }}
          </el-col>
          <el-col :span="8" v-for="(el, index) in item.filters.filter((el) => el.name != '排行榜')" :key="index" class="my-1">
            <el-link
              class="cursor-pointer"
              @click.stop="
                () => {
                  ctypeObj = el
                  currentPage = 1
                  gridRef.setScrollTop(0)
                  fetchListData(el)
                  modalVisible = false
                }
              "
              :type="ctypeObj.name == el.name ? 'danger' : 'default'"
              >{{ el.name }}</el-link
            >
          </el-col>
        </el-row>
        <Empty v-if="cates[type] && !cates[type].length && !loading" />
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script name="playlist" setup>
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import GridList from '@/views/components/GridList.vue'
defineOptions({ name: 'playlist' })
const { config } = useConfigStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const $musicApiUrl = proxy.$musicApiUrl
const route = useRoute()
const type = ref(route.query.type || 'qq')
const ctype = ref(route.query.ctype || '')
const types = computed(() => config.types)
const cates = ref({})
const playlist = ref([])
const banner = ref([])
const loading = ref(true)
const bannerCarousel = ref(null)
const bannerLoading = ref(false)
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
const fetchBannerData = (item) => {
  banner.value = [1, 2, 3].concat(new Array(3).fill('')).map((_, index) => ({
    id: index + 1,
    imageUrl: `https://p3.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4950782523/e9a6/d9b6/c92f/4950782523-1_1_.jpg`,
  }))
  bannerLoading.value = true
  fetch(`${$musicApiUrl}/banner`)
    .then((res) => res.json())
    .then((res) => {
      bannerLoading.value = false
      if (!res.banners) return
      banner.value = res.banners
    })
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
  gridRef.value?.setScrollTop(0)
  ctype.value = item.id || ctype.value
  loading.value = true
  playlist.value = new Array(12).fill('').map((_, index) => ({
    id: (index + 1).toString(),
  }))
  fetch(`${$apiUrl}/music?type=${item.type || type.value}&offset=${currentPage.value - 1}&limit=12&id=${ctype.value}`)
    .then((res) => res.json())
    .then((res) => {
      loading.value = false
      if (!res.data) return
      total.value = res.data.total || 999
      if (currentPage.value) playlist.value = res.data.result
      hasNextPage.value = !!res.data.hasNextPage
    })
    .catch(() => {})
}
const handleBannerClick = (e, item) => {
  e.stopPropagation()
  window.open(item.url)
}
onMounted(() => {
  fetchData()
  fetchBannerData()
})
</script>

<style scoped>
</style>
