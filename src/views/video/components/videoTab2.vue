<template>
  <div class="tab-content tab-cate-content tab-singer-content md:mr-1">
    <div class="recommend" v-for="obj in tabData.list" :key="obj.title">
      <div class="title flex align-center w-full mb-2 justify-between">
        <h3 class="name mr-2 md:mr-8">{{ obj.title || '推荐歌单' }}</h3>
        <div class="tags flex flex-4" style="margin-bottom: 0">
          <div class="name top flex" v-for="(formItem, key) in obj.form" :key="formItem.title">
            <div class="cates hidden md:flex fl">
              <div class="cursor-pointer" v-for="(item, index) in formItem.options" :key="item.id">
                <span class="cates-item" :class="{ active: item.code === formItem.value || item === formItem.value }" @click="onCateTagClick(item, formItem, key, obj)">{{ item.name || item }}</span>
                <i class="line mx-3" v-html="index < formItem.options.length - 1 ? '|' : ''"></i>
              </div>
            </div>
            <div class="block md:hidden flex items-center" v-if="formItem.options">
              <el-dropdown
                trigger="click"
                :show-arrow="false"
                popper-class="backdrop-blur !z-10000"
                @command="
                  (item) => {
                    onCateTagClick(item, formItem, key, obj)
                  }
                "
              >
                <span class="el-dropdown-link flex flex-1 items-center">
                  {{ formItem.options?.find((el) => el.code === formItem.value)?.name || formItem.title }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="item in formItem.options" :key="item.code" :command="item">{{ item.name }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <span class="tr more flex items-center cursor-pointer" @click="onMoreClick(obj)"
          >更多<el-icon class="icon-music-right"><arrow-right /></el-icon
        ></span>
      </div>
      <el-skeleton :loading="obj.loading" animated>
        <template #template>
          <el-row class="grid-list flex flex-wrap overflow-hidden rounded-md md:mb-2" :gutter="10">
            <el-col v-for="(item, index) in 8" :span="12" :sm="obj.type == 4 ? 12 : 8" :md="obj.type == 4 ? 12 : 6" :xl="obj.type == 4 ? 12 : 4" :item="item" :category="obj.category" :index="index" :type="obj.type" :key="item.id">
              <div class="flex flex-col w-full mb-2">
                <el-skeleton-item variant="image" class="!rounded w-full !h-[100px] md:!h-[160px]" />
                <div class="mt-2" v-if="obj.type != 4">
                  <el-skeleton-item variant="text" style="width: 100%" />
                  <el-skeleton-item variant="text" style="width: 60%" />
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
        <template #default>
          <el-row class="grid-list flex flex-wrap overflow-hidden rounded-md md:mb-2" :gutter="10" :style="{ ...obj.styles }" v-loading="obj.loading">
            <grid-list v-for="(item, index) in obj.data" :item="item" :category="obj.category" :index="index" :type="obj.type" @click.stop="onListClick(item)" :key="item.id"></grid-list>
          </el-row>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.recommend {
  padding-top: 10px;
  .title {
    margin-bottom: 20px;
    h3 {
      line-height: 24px;
      font-size: 24px;
      border-left: 3px solid var(--el-color-primary);
      padding-left: 10px;
    }
  }
}
.cates-item {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  &.active {
    color: var(--el-color-primary);
  }
}
</style>
<script>
import {
  // ref,
  // computed,
  watch,
  reactive,
  toRefs,
  // getCurrentInstance,
  // onBeforeMount
  onMounted,
} from 'vue'
import { useVideoStore } from '@/stores/video'
import { useRouter } from 'vue-router'
import GridList from './GridList.vue'
export default {
  name: 'videoTab2',
  components: {
    // Swiper,
    // SwiperSlide,
    GridList,
  },
  // directives: {
  //     swiper: directive
  // },
  setup() {
    const store = useVideoStore()
    const tabData = store.tab2Data
    const router = useRouter()
    const state = reactive({
      loading: true,
      tabData: {
        dayData: {
          weeks: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
          day: new Date().getDate(),
          name: '每日歌曲推荐',
          copywriter: '根据您的音乐口味生成每日更新',
        },
        // ...computed(() => store.home).value,
        list: [
          {
            loading: true,
            title: '最新MV',
            category: 1,
            type: 3,
            path: '/video/personalized',
            query: {
              type: '最新',
              tabName: 'personalized',
            },
            data: tabData.personalized?.slice(0, 8) || [],
            form: {
              area: {
                title: '语种',
                value: router.currentRoute.value.query.area || '内地',
                options: [
                  {
                    code: '内地',
                    name: '内地',
                  },
                  {
                    code: '港台',
                    name: '港台',
                  },
                  {
                    code: '欧美',
                    name: '欧美',
                  },
                  {
                    code: '日本',
                    name: '日本',
                  },
                  {
                    code: '韩国',
                    name: '韩国',
                  },
                ], // 语种
              },
              type: {
                value: '全部',
              },
              order: {
                value: '最热',
              },
            },
            styles: {
              minHeight: '460px',
            },
          },
          {
            loading: true,
            title: '热播MV',
            category: 2,
            type: 3,
            path: '/video/hotMV',
            query: {
              tabName: 'hotMV',
            },
            data: tabData.hotMV?.slice(0, 8) || [],
            styles: {},
          },
          {
            loading: true,
            title: '网易出品',
            category: 3,
            type: 3,
            path: '/video/exclusive',
            query: {
              tabName: 'exclusive',
            },
            data: tabData.exclusive?.slice(0, 8) || [],
            styles: {
              marginBottom: '20px',
            },
          },
          {
            loading: true,
            title: 'MV排行榜',
            category: 5,
            type: 4,
            path: '/video/topMV',
            query: {
              tabName: 'topMV',
            },
            data: tabData.topMV?.slice(0, 10) || [],
            form: {
              area: {
                title: '语种',
                value: router.currentRoute.value.query.area || '内地',
                options: [
                  {
                    code: '内地',
                    name: '内地',
                  },
                  {
                    code: '港台',
                    name: '港台',
                  },
                  {
                    code: '欧美',
                    name: '欧美',
                  },
                  {
                    code: '日本',
                    name: '日本',
                  },
                  {
                    code: '韩国',
                    name: '韩国',
                  },
                ], // 语种
              },
              type: {
                value: '全部',
              },
              order: {
                value: '最热',
              },
            },
            styles: {
              minHeight: '660px',
            },
          },
        ],
      },
      offset: 1,
      limit: 39,
    })
    // const { ctx } = getCurrentInstance()
    onMounted(() => {
      getData()
    })
    watch(
      () => tabData.banner,
      (value) => {
        state.tabData.banner = value
      }
    )
    watch(
      () => [tabData.personalized, tabData.hotMV, tabData.exclusive, tabData.topMV],
      (value) => {
        state.tabData.list.map((el, i) => {
          el.data = value[i].slice(0, 8)
          if (i === 3) {
            el.data = value[3].slice(0, 10)
          }
        })
      }
    )
    watch(
      () => store.isExtend,
      (value) => {
        console.log(value, 'state.isExtend')
      }
    )
    // methods
    const getData = async () => {
      state.loading = true
      store.getTab2Data().then((res) => {
        state.loading = false
        state.tabData.list.map((el) => {
          el.loading = false
        })
      })
    }
    const onListClick = (item) => {
      const audio = document.getElementsByTagName('audio')[0]
      audio?.pause()
      store.setVideoPlayer({
        id: item.id || item.vid || item.mvid,
        type: 'mv',
        cover: item.cover,
      })
      store.setVideoPlayerShow(true)
    }
    // 整理筛选条件
    const sortData = (obj) => {
      const data = {}
      for (const key in obj.form) {
        data[key] = obj.form[key].value
      }
      return data
    }
    const onCateTagClick = (item, formItem, key, obj) => {
      // console.log(item, formItem, key, 'item, formItem, key')
      formItem.value = item.code !== undefined ? item.code : item
      obj.data = []
      const data = sortData(obj)
      //   router.push({
      //     path: router.currentRoute.value.path,
      //     query: {
      //       ...router.currentRoute.value.query,
      //       ...data,
      //     },
      //   })
      data.limit = state.limit
      data.ctype = obj.category
      obj.query = { ...obj.query, ...data }
      obj.loading = true
      store.getVideoByParams(data).then((res) => {
        obj.loading = false
      })
    }
    const onMoreClick = (obj) => {
      const route = {
        path: '',
        query: {
          tabName: '',
        },
      }
      if (obj.path) {
        route.path = obj.path
      } else {
        route.path = router.currentRoute.value.path
      }
      route.query = obj.query
      route.query.title = obj.title
      route.query.type = obj.type
      route.query.category = obj.category
      router.push(route)
    }
    return {
      ...toRefs(state),
      onListClick,
      onCateTagClick,
      onMoreClick,
    }
  },
}
</script>
