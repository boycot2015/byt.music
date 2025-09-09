<template>
  <div class="video">
    <!-- <el-tabs class="tab-list flex justify-center mb-2" v-model="activeTab">
      <el-tab-pane v-for="item in tabMenu" :key="item.name" :label="item.name" :name="item.type" :class="{ active: item.type === activeTab }" @click="onTabClick(item)" class="tab-list-item js-tab-item" data-type="home">
        <component :is="item.component"></component>
      </el-tab-pane>
    </el-tabs> -->
    <videoTab2></videoTab2>
  </div>
</template>
<script>
import {
  // ref,
  // computed,
  // watch,
  reactive,
  toRefs,
  // getCurrentInstance,
  // onBeforeMount
  // onMounted
} from 'vue'
import { useRouter } from 'vue-router'
// import videoTab1 from './components/videoTab1.vue'
import videoTab2 from './components/videoTab2.vue'
export default {
  name: 'videos',
  components: {
    // Swiper,
    // SwiperSlide,
    // videoTab1,
    videoTab2,
  },
  // directives: {
  //     swiper: directive
  // },
  setup() {
    const router = useRouter()
    // console.log(router.currentRoute.value, 'router.currentRoute')
    const query = router.currentRoute.value.query.tabName || 'MV'
    const state = reactive({
      activeTab: query,
      tabMenu: [
        {
          name: 'MV',
          type: 'MV',
          component: markRaw(videoTab2),
        },
        // {
        //   name: '视频',
        //   type: 'video',
        //   component: markRaw(videoTab1),
        // },
      ],
    })
    // 点击tab切换数据
    const onTabClick = (item) => {
      state.activeTab = item.type
      router.push({
        path: '/video/index',
        query: {
          // tabName: state.activeTab,
          ...router.currentRoute.value.query,
        },
      })
      // getData(item.type)
    }
    return {
      ...toRefs(state),
      onTabClick,
    }
  },
}
</script>
