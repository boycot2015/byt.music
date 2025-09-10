<template>
  <div class="video-detail top-0 md:absolute md:pt-2 active" v-loading="loading" element-loading-text="资源加载中...">
    <el-scrollbar class="scroll-view video-detail-scroll" ref="scrollDom" height="calc(100vh - 80px)">
      <div class="flex flex-col md:flex-row justify-center md:w-[1000px] xl:w-[1200px] mx-auto">
        <div class="left md:mr-10">
          <h3 class="title px-2 hidden md:flex flex-col md:flex-row items-center">
            <!-- <el-icon class="back-btn icon-music-left cursor-pointer" :size="24" @click="turnBack"><Close /></el-icon> -->
            <p class="name hidden md:block line-clamp-1">{{ playData.title || playData.name }}</p>
            <span class="level !rounded-sm hidden md:block text-[red] border-[1px] border-[red] ml-2">{{ playData.level === 'exhigh' ? '极高音质' : '标准音质' }}</span>
            <span v-if="playData.type" class="type red pad2 font12">{{ playData.type.toUpperCase() }}</span>
            <span class="singer" v-if="playData.creator">{{ playData.creator.nickname }}</span>
          </h3>
          <div class="cover md:pl-2 md:mt-4 h-[225px] sm:h-[360px]">
            <video id="play-video" class="w-full" v-if="playData.url" volume="0.3" :autoplay="true" :src="playData.url" controls="controls"></video>
            <div class="img overflow-hidden md:min-w-[600px] xl:min-w-[800px] h-[225px] sm:h-[360px]" v-else>
              <el-image loading="lazy" class="h-[225px] sm:h-[360px] w-full rounded" :src="playData.cover" alt="" />
            </div>
          </div>
          <div class="operation px-2 flex flex-nowrap">
            <div class="play-btn collect">
              <i class="icon-music-star"></i>
              <span>点赞({{ playData.praisedCount || countData.commentCount }})</span>
            </div>
            <div class="play-btn collect">
              <i class="icon-music-collect"></i>
              <span>收藏({{ playData.subscribeCount || countData.likedCount }})</span>
            </div>
            <div class="play-btn share">
              <i class="icon-music-share"></i>
              <span>分享({{ playData.shareCount }})</span>
            </div>
            <div class="play-btn download !mr-0" @click="downloadMV">
              <i class="icon-music-download"></i>
              <span>下载MV</span>
            </div>
          </div>
          <div class="div hidden md:block">
            <comment v-if="playData.id" :data="{ ...data, ...playData }" :title="'评论'" type="video"></comment>
          </div>
        </div>
        <div class="right px-3 md:px-0 !w-full flex flex-1 flex-col">
          <div class="content">
            <div class="title">MV介绍</div>
            <div class="flex text-md justify-between pt-2">
              <span class="time">发布时间: {{ new Date(playData.publishTime).toLocaleDateString().split('/').join('-') }}</span>
              <span class="times" v-if="playData.playTime">播放次数: {{ playData.playTime }}</span>
            </div>
            <div
              class="info"
              :class="{
                more: (playData.description && playData.description.length > 100) || (playData.desc && playData.desc.length > 100),
              }"
              v-if="(playData.description && playData.description !== null) || (playData.desc && playData.desc !== null)"
            >
              简介：{{ playData.description || playData.desc }}
            </div>
            <div class="tags flex">
              <p class="name fl">标签：</p>
              <template v-if="playData.videoGroup && playData.videoGroup.length">
                <span class="tag fl" v-for="(tag, tindex) in playData.videoGroup" :key="tag.id" v-html="tag.name + (tindex < playData.videoGroup.length - 1 ? ' / ' : '')"> </span>
              </template>
              <span v-else>暂无~</span>
            </div>
          </div>
          <div class="same-content">
            <div class="same-music-list grid-list" v-if="videos && videos.length">
              <h2 class="title">相关推荐</h2>
              <div v-for="item in videos" @click="onItemlistClick(item, 2)" :key="item.id" class="grid-list-item ftype-0 cursor-pointer" data-id="{{item.id}}" data-url="{{item.mp3Url}}" data-type="{{item.type}}">
                <div class="same-play-list-item grid-list-item js-list-detail flex ftype-0 mb-2" data-id="{{item.id}}" data-type="{{item.type}}" data-url="{{item.mp3Url}}">
                  <div class="img !relative">
                    <!-- <span class="icon icon-music-video"></span> -->
                    <div class="right absolute left-0 top-0 w-full flex justify-between" v-if="item.playCount || item.playTime">
                      <el-icon class="icon-video"><VideoCamera /></el-icon>
                      <span class="play-count">{{ item.score || item.playCount || item.playTime }}</span>
                    </div>
                    <el-image loading="lazy" class="rounded-md" :src="item.coverUrl" alt="" />
                  </div>
                  <div class="text flex-1 ml-2 flex flex-col justify-between" :title="item.title">
                    <p class="name line-clamp-2">{{ item.title }}</p>
                    <p v-for="(singer, index) in item.creator" :key="singer.id" class="singer line-one" v-html="singer.userName + (index < item.creator.length - 1 ? '/' : '')"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="div md:hidden">
        <comment v-if="playData.id" :data="{ ...data, ...playData }" :title="'评论'" type="video"></comment>
      </div>
    </el-scrollbar>
    <el-backtop selector=".video-detail .el-scrollbar__wrap"></el-backtop>
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
      object-fit: cover;
    }
  }
  .left {
    > .title {
      // font-family: 微软雅黑;
      font-size: 16px;
      line-height: 22px;
      .singer {
        margin-left: 10px;
        color: $c-666;
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
      margin-bottom: 30px;
      .play-btn {
        min-width: 50px;
        line-height: 26px;
        font-size: 12px;
        color: $c-333;
        padding: 0 10px;
        border-radius: $border-radius;
        background-color: $white;
        border: 1px solid $c-e8;
        margin-right: 15px;
        cursor: pointer;
        i {
          margin-right: 2px;
        }
        &.play {
          width: 100px;
          border: 1px solid $primary;
          background-color: $primary;
          color: $white;
          i::after {
            color: $white;
            font-size: 12px;
            padding: 0px;
            background-color: transparent;
            border: 1px solid $white;
          }
          i.icon-plus {
            margin-right: 0;
            margin-left: 12px;
            &::after {
              border: 0;
            }
          }
          span {
            padding: 8px 10px 8px 0;
            border-right: 1px solid $c-ccc;
          }
        }
      }
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
    color: $c-666;
    .title {
      font-size: 18px;
      color: $c-333;
      // font-family: 微软雅黑;
      padding-bottom: 10px;
      border-bottom: 1px solid $c-e8;
      span {
        padding-left: 10px;
        font-size: 12px;
        color: $c-999;
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
      color: $c-999;
    }
    .tags {
      margin-bottom: 10px;
      .tag {
        color: deepskyblue;
      }
    }
    .same-play-list-item {
      height: 90px;
      .img {
        width: 120px;
        height: 70px;
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
import { useRouter } from 'vue-router'
import { downloadFile } from '@/utils'
import Comment from '@/components/Comment/Comment.vue'
export default {
  components: {
    Comment,
  },
  setup(props) {
    const store = useVideoStore()
    const rootStore = store
    const detailStore = rootStore.videoDetail
    const videoParams = rootStore.videoParams
    const router = useRouter()
    const lyricScrollDom = ref(null)
    const scrollDom = ref(null)
    const state = reactive({
      playData: {
        ...videoParams,
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
      // console.log(router, 'playlistRes')
      const params = {
        id: videoParams.id,
        type: videoParams.type || 'video',
        limit: state.limit,
        offset: state.offset,
      }
      if (videoParams.id) {
        getData({
          id: videoParams.id,
          type: videoParams.type || 'video',
        })
        getData(params)
      }
      document.querySelector('.scroll-view')?.addEventListener('scroll', function (e) {
        // 获取定义好的scroll盒子
        // const el = scrollDom.value
        state.scrollTop = this.scrollTop
        state.clientHeight = this.clientHeight
        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (condition && !state.loading && detailStore.hasMore && detailStore.total >= state.data.comments.length) {
          state.offset++
          getData({ ...params, offset: state.offset, limit: state.limit })
        }
      })
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
        id: item.id || item.vid || item.mvid,
        cover: item.coverUrl,
        type: router.currentRoute.value.query.name === 'MV' ? 'mv' : 'video',
      }
      state.playData = params
      scrollToTop()
      store.setVideoPlayer(params)
      store.setVideoPlayerShow(true)
    }
    // const initSwiper = () => {
    //     /* eslint-disable */
    //     new Swiper('.lyric-swiper-container', state.swiperOption)
    // }
    const scrollToTop = () => {
      scrollDom.value?.setScrollTop(0)
    }
    const turnBack = () => {
      document.getElementById('play-video')?.pause()
      store.setVideoPlayerShow(false)
    }
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
    return {
      ...toRefs(state),
      router,
      lyricScrollDom,
      onItemlistClick,
      scrollDom,
      turnBack,
      scrollToTop,
      downloadMV,
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
