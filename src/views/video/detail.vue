<template>
  <div class="video-detail" v-loading="loading" element-loading-text="资源加载中...">
    <el-scrollbar class="scroll-view video-detail-scroll" ref="scrollDom" :height="'calc(100vh - 64px)'" @end-reached="onReached" @scroll="handleScroll">
      <div class="flex flex-col lg:flex-row justify-center lg:w-[1000px] xl:w-[1200px] 2xl:w-[1440px] mx-auto">
        <div class="left lg:mr-10 max-w-[100%] lg:max-w-[600px] xl:max-w-[800px]">
          <h3 class="title md:px-0 hidden md:flex flex-col md:flex-row items-center">
            <!-- <el-icon class="back-btn icon-music-left cursor-pointer" :size="24" @click="turnBack"><Close /></el-icon> -->
            <p class="name mr-2 hidden md:block line-clamp-1">{{ playData.title || playData.name }}</p>
            <span class="level !rounded-sm hidden md:block text-[red] border-[1px] border-[red]">{{ playData.level === 'exhigh' ? '极高音质' : '标准音质' }}</span>
            <span v-if="playData.type" class="type font12">{{ playData.type.toUpperCase() }}</span>
          </h3>
          <div class="cover md:mt-4 xs:h-[200px] xl:h-[460px]">
            <video id="play-video" class="w-full xl:min-w-[800px]" :poster="playData.cover" volume="0.3" :autoplay="true" :src="playData.url" controls="controls"></video>
          </div>
          <div class="operation px-2 md:px-0 flex flex-nowrap !space-x-2">
            <el-tag type="primary" class="cursor-pointer md:!text-md" v-for="item in operations" :key="item.name" @click="item.click ? item.click() : null">
              <div class="flex items-center">
                <el-icon class="mr-1"><component class="!text-[14px]" :is="item.icon" /></el-icon>
                <span
                  ><span class="hidden md:inline">{{ item.name }}</span
                  ><span v-if="item.render">({{ item.render({ ...playData, ...countData }) }})</span></span
                >
              </div>
            </el-tag>
          </div>
          <div class="div hidden mt-6 lg:block" v-if="playData.id && !config.isMobile">
            <h2 class="title mb-0 border-b pb-2 border-b-[var(--el-border-color)]">MV评论</h2>
            <comment ref="commentRef" :data="{ ...data, ...playData }" :title="'评论'" type="mv"></comment>
          </div>
        </div>
        <div class="right px-3 flex-1 mt-2 md:mt-0 lg:px-0 !w-full flex flex-col">
          <div class="content">
            <div class="title mb-2">MV介绍</div>
            <span class="singer">作者: {{ playData.creator ? playData.creator.nickname : playData.artistName }}</span>
            <div class="flex text-md justify-between">
              <span class="time mb-2">发布时间: {{ new Date(playData.publishTime).toLocaleDateString().split('/').join('-') }}</span>
              <span class="times" v-if="playData.playTime">播放次数: {{ playData.playTime }}</span>
            </div>
            <el-scrollbar max-height="400px" class="text-justify" v-if="(playData.description && playData.description !== null) || (playData.desc && playData.desc !== null)">
              <div class="pr-5">简介：{{ playData.description || playData.desc }}</div>
            </el-scrollbar>
            <div class="tags flex" v-if="playData.videoGroup && playData.videoGroup.length">
              <p class="name whitespace-nowrap">标签：</p>
              <template v-if="playData.videoGroup && playData.videoGroup.length">
                <span class="tag whitespace-nowrap cursor-pointer" v-for="(tag, tindex) in playData.videoGroup" :key="tag.id" v-html="tag.name + (tindex < playData.videoGroup.length - 1 ? ' / ' : '')"> </span>
              </template>
            </div>
          </div>
          <div class="same-content md:sticky top-0">
            <div class="same-music-list grid-list" v-if="videos && videos.length">
              <h2 class="title mb-3 !pb-2">相关推荐</h2>
              <div v-for="item in videos" @click="onItemlistClick(item, 2)" :key="item.id" class="grid-list-item ftype-0 cursor-pointer" data-id="{{item.id}}" data-url="{{item.mp3Url}}" data-type="{{item.type}}">
                <div class="same-play-list-item grid-list-item js-list-detail flex ftype-0 mb-2" data-id="{{item.id}}" data-type="{{item.type}}" data-url="{{item.mp3Url}}">
                  <div class="img !relative">
                    <div class="right absolute left-0 top-0 w-full flex justify-between" v-if="item.playCount || item.playTime">
                      <el-icon class="icon-video"><VideoCamera /></el-icon>
                      <span class="play-count">{{ item.score || item.playCount || item.playTime }}</span>
                    </div>
                    <el-image loading="lazy" class="rounded-md" :src="item.coverUrl" alt="" />
                  </div>
                  <div class="text flex-1 ml-2 flex flex-col justify-between" :title="item.title">
                    <p class="name line-clamp-2">{{ item.title }}</p>
                    <div class="whitespace-nowrap flex text-sm text-[var(--el-text-color-regular)]">
                      <p v-for="(singer, index) in item.creator" :key="singer.id" class="singer whitespace-nowrap" v-html="singer.userName + (index < item.creator.length - 1 ? '/' : '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="div mt-6 lg:hidden" v-if="playData.id && config.isMobile">
        <h2 class="title text-lg px-2 lg:px-0 mb-0 border-b pb-2 border-b-[var(--el-border-color)]">MV评论</h2>
        <comment ref="commentRef2" :data="{ ...data, ...playData }" :title="'评论'" type="mv"></comment>
      </div>
    </el-scrollbar>
    <el-backtop target=".scroll-view .el-scrollbar__wrap"></el-backtop>
  </div>
</template>
<style lang="scss" scoped>
.video-detail {
  align-items: flex-start;
  height: 100%;
  position: relative;
  overflow: hidden;
  .scroll-view {
    margin: 0 auto;
    align-items: flex-start;
  }
  .cover {
    margin-bottom: 15px;
    #play-video {
      height: 100%;
      // object-fit: fill;
    }
  }
  .left {
    > .title {
      // font-family: 微软雅黑;
      font-size: 16px;
      line-height: 22px;
      .singer {
        margin-left: 10px;
        font-size: 12px;
      }
      .name {
        max-width: 480px;
      }
      .back-btn {
        position: fixed;
        right: 0px;
        top: 15px;
        margin-right: 5px;
        &::after {
          font-size: 24px;
        }
      }
      .level {
        margin-right: 8px;
        padding: 0px 5px;
        border-radius: 2px;
        white-space: nowrap;
      }
    }
    .operation {
      margin-bottom: 10px;
    }
    .comment {
      padding-right: 0;
      .comment-item .text {
        width: 560px;
      }
    }
  }
  .right {
    // font-family: 微软雅黑;
    .title {
      font-size: 18px;
      // font-family: 微软雅黑;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--el-border-color);
      span {
        padding-left: 10px;
        font-size: 12px;
      }
    }
    .info {
      // font-family: 宋体;
      line-height: 20px;
      margin-bottom: 20px;
      &.more {
        max-height: 200px;
        overflow: hidden;
        overflow-y: auto;
      }
    }
    .time-times {
      line-height: 32px;
    }
    .tags {
      margin-bottom: 10px;
      .tag {
        color: deepskyblue;
      }
    }
    .same-play-list-item {
      height: 80px;
      .img {
        width: 100px;
        height: 50px;
      }
    }
  }
}
.video-detail {
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  &.hide {
    transform: translateY(9999px);
  }
  &.show {
    transform: translateY(0px);
  }
}
</style>
<script>
import {
  ref,
  // computed,
  watch,
  reactive,
  toRefs,
  // getCurrentInstance,
  onMounted,
  onBeforeMount,
} from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { useVideoStore } from '@/stores/video'
import { useConfigStore } from '@/stores/config'
import { useRouter } from 'vue-router'
import { downloadFile, filterPlayCount } from '@/utils'
import Comment from '@/components/Comment/Comment.vue'
export default {
  components: {
    Comment,
  },
  setup(props) {
    const store = useVideoStore()
    const { config } = useConfigStore()
    const rootStore = store
    const detailStore = rootStore.videoDetail
    const videoParams = computed(() => rootStore.videoParams)
    const router = useRouter()
    const lyricScrollDom = ref(null)
    const scrollDom = ref(null)
    const commentRef = ref(null)
    const commentRef2 = ref(null)
    const downloadMV = () => {
      const url = state.playData.url
      let loading = ElLoading.service({
        lock: true,
        fullscreen: true,
        text: '下载中',
        target: '.video-detail',
        customClass: '!z-100002 backdrop-blur',
      })
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => {
          ElMessage({
            message: '下载成功',
            type: 'success',
            customClass: '!z-100002 backdrop-blur !w-[80vw] md:!w-[auto]',
          })
          loading.close()
          downloadFile(data, state.playData.name + '.mp4')
        })
    }
    const state = reactive({
      playData: {
        ...videoParams.value,
      },
      countData: {},
      data: {
        total: 0,
        hotComments: [], // 精彩评论
        comments: [], // 所有评论
      },
      scrollTop: 0,
      clientHeight: 0,
      limit: 50,
      offset: 0,
      loading: true,
      videos: [],
      operations: [
        {
          icon: 'IconLike',
          name: '点赞',
          render: (row) => filterPlayCount(row.praisedCount || row.commentCount, 1),
        },
        {
          icon: 'IconHeart',
          name: '收藏',
          render: (row) => filterPlayCount(row.subscribeCount || row.likedCount, 1),
        },
        {
          icon: 'Share',
          name: '分享',
          prop: 'shareCount',
          render: (row) => filterPlayCount(row.shareCount, 1),
        },
        {
          icon: 'Download',
          name: '下载视频',
          click: downloadMV,
        },
      ],
    })
    // const { ctx } = getCurrentInstance()
    onBeforeMount(async () => {})
    watch(
      () => [detailStore.hotComments, detailStore.comments, detailStore.playData, detailStore.total, detailStore.videos, detailStore.countData],
      (value) => {
        if (state.offset) {
          if (detailStore.total >= state.data.comments.length) {
            state.data.comments = [...state.data.comments, ...value[1]]
          }
          return
        }
        state.data.hotComments = value[0]
        state.data.comments = value[1]
        state.playData = value[2]
        state.data.total = value[3]
        state.videos = value[4]
        state.countData = value[5]
      }
    )
    watch(
      () => rootStore.videoParams,
      (value) => {
        value.id &&
          getData({
            id: value.id,
            type: value.type || 'video',
          })
      }
    )
    onMounted(() => {
      if (videoParams.value.id) {
        getData({
          id: videoParams.value.id,
          type: videoParams.value.type || 'mv',
        })
      }
    })
    // methods
    const getData = async (params) => {
      if (state.offset > 0) {
        state.loading = true
        await store.getVideoCommentByPage(params).then((res) => {
          state.loading = false
        })
        return
      }
      await store.getVideoData(params).then((res) => {
        state.loading = false
      })
    }
    const onItemlistClick = (item) => {
      state.loading = true
      let params = {
        name: item.name || item.title,
        id: item.id || item.vid || item.mvid,
        cover: item.coverUrl,
        artistName: item.creator?.map((el) => el.userName || el.name).join('/'),
        type: 'mv',
      }
      state.playData = params
      scrollToTop()
      store.setVideoPlayer(params)
      store.setVideoPlayerShow(true)
    }
    const scrollToTop = () => {
      scrollDom.value?.setScrollTop(0)
    }
    const turnBack = () => {
      document.getElementById('play-video')?.pause()
      store.setVideoPlayerShow(false)
    }
    const onReached = (direction) => {
      if (direction === 'bottom') {
        !config.isMobile && commentRef.value?.fetchComments()
        config.isMobile && commentRef2.value?.fetchComments()
      }
    }
    function togglePictureInPicture() {
      if (document.pictureInPictureElement) {
        document
          .exitPictureInPicture()
          .then(() => {
            console.log('退出 Picture-in-Picture 模式')
          })
          .catch((error) => {
            console.error('退出 Picture-in-Picture 模式失败:', error)
          })
      } else {
        if (document.pictureInPictureEnabled) {
          document.getElementById('play-video')?.requestPictureInPicture()
        }
      }
    }
    const handleScroll = () => {
      if (scrollDom.value.scrollTop <= 500) {
        togglePictureInPicture()
      }
    }
    return {
      ...toRefs(state),
      router,
      config,
      lyricScrollDom,
      commentRef,
      commentRef2,
      scrollDom,
      onItemlistClick,
      turnBack,
      scrollToTop,
      filterPlayCount,
      downloadMV,
      onReached,
      handleScroll,
    }
  },
}
</script>

<style>
.scale-fade-enter-active {
  transition: all 0.3s ease;
}

.scale-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.scale-fade-enter,
.scale-fade-leave-to

/* .scale-fade-leave-active for below version 2.1.8 */ {
  transform: scale(0.5);
  transform-origin: 80px 200px;
  opacity: 0;
}
</style>
