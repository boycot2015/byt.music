<template>
  <div class="music-home">
    <div class="tab-list flexbox-h just-c">
      <div v-for="item in tabMenu" :key="item.name" :class="{ active: item.type === activeTab }" @click="onTabClick(item)" class="tab-list-item js-tab-item" data-type="home">{{ item.name }}</div>
    </div>
    <video-tab1 v-if="activeTab === tabMenu[0].type"></video-tab1>
    <video-tab2 v-show="activeTab === tabMenu[1].type"></video-tab2>
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
import videoTab1 from './components/videoTab1.vue'
import videoTab2 from './components/videoTab2.vue'
export default {
  name: 'videos',
  components: {
    // Swiper,
    // SwiperSlide,
    videoTab1,
    videoTab2,
  },
  // directives: {
  //     swiper: directive
  // },
  setup() {
    const router = useRouter()
    // console.log(router.currentRoute.value, 'router.currentRoute')
    const query = router.currentRoute.value.query.tabName || 'video'
    const state = reactive({
      activeTab: query,
      tabMenu: [
        {
          name: '视频',
          type: 'video',
        },
        {
          name: 'MV',
          type: 'MV',
        },
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
