<template>
  <el-col
    :span="6"
    class="grid-list-item flex flex-col rounded js-list-detail relative"
    v-if="(item.list && item.list.length) || item.img1v1Url || item.coverImgUrl || item.coverUrl || item.cover || item.sPicUrl || item.picUrl"
    :title="item.rcmdtext || item.name"
    :class="`type-${type || item.type} ftype-${item.ftype}`"
  >
    <ul v-if="item.list" class="grid-list js-child-list fl !overflow-hidden">
      <li class="grid-list-item flex js-list-detail" :class="`type-${child.type} ftype-${child.ftype}`" :title="child.name" v-for="(child, cindex) in item.list" :key="cindex" data-url="{{child.mp3Url}}">
        <span class="order fl" v-html="index * item.list.length + (cindex + 1) < 10 ? '0' + (index * item.list.length + (cindex + 1)) : index * item.list.length + (cindex + 1)"></span>
        <div class="img" :class="{ fl: child.ftype == 0 }">
          <el-icon class="icon"><VideoPlay /></el-icon>
          <el-image lazy fit="contain" :src="child.album && child.album.picUrl" alt="" />
        </div>
        <div class="text" :class="`${child.ftype == 0 ? 'fl' : ''}`" :title="child.rcmdtext || child.name">
          <p class="name line-two tl">{{ child.name }}</p>
          <p class="desc tl" v-if="child.album">
            <i class="icon-play-video"></i>
            <span class="singer" v-for="(singer, index) in child.album.artists" :key="index" v-html="singer.name + (index < child.album.artists.length - 1 ? '/' : '')"> </span>
          </p>
        </div>
      </li>
    </ul>
    <template v-else>
      <span class="order float-left" v-if="type === 4" v-html="index < 9 ? '0' + (index + 1) : index + 1"></span>
      <div class="img" :class="`${item.ftype == 0 ? 'fl' : ''}`">
        <!-- :style="{
              background: `url(${item.img1v1Url || item.coverImgUrl || item.coverUrl || item.cover || item.sPicUrl || item.picUrl
          }) no-repeat center/cover`}" -->
        <!-- <img :src="item.img1v1Url || item.coverImgUrl || item.coverUrl || item.cover || item.sPicUrl || item.picUrl" alt=""> -->
        <!-- v-if="(item.type == 0 || category == 3) && item.copywriter" -->
        <span class="copy-writer" v-if="(item.type == 0 || category == 3) && item.copywriter">{{ item.copywriter }}</span>
        <div class="right" v-if="item.playCount || item.playTime">
          <span class="icon" v-if="type !== 4" :class="`icon-music-${item.type == 5 || type == 3 ? 'video' : 'erphone'}`"></span>
          <span v-else>热度:</span>
          <span class="play-count">{{ item.score || item.playCount || item.playTime }}</span>
        </div>
        <div class="left" v-if="item.type == 5 && category !== 3">
          <span class="icon icon-music-video"></span>
        </div>
        <p class="desc line-one" v-if="item.rcmdtext">{{ item.name }}</p>
        <el-image lazy fit="contain" :src="item.img1v1Url || item.coverImgUrl || item.coverUrl || item.cover || item.sPicUrl || item.picUrl" alt="" />
        <p class="time" v-if="type === 2">{{ new Date().toLocaleDateString().split('/').join('-') }}</p>
        <span class="creator" v-if="item.creator && type !== 3"><i class="icon-music-user"></i>{{ item.creator.nickname }}</span>
      </div>
      <div class="text" :class="`${item.ftype == 0 ? 'fl' : ''}`">
        <p class="name line-two tl" :class="{ 'line-one': type === 3 || type === 4 }">{{ item.rcmdtext || item.name || item.title }}</p>
        <span class="rcmdText line-one" v-if="item.rcmdText">{{ item.rcmdText }}</span>
        <span class="lastProgramName line-one" v-if="item.lastProgramName">{{ item.lastProgramName }}</span>
        <div class="price red" v-if="item.originalPrice">￥{{ item.originalPrice / 100 }}</div>
        <span class="creator" v-if="item.creator && type === 3"><i>by</i>{{ item.creator.nickname }}</span>
        <p class="creator line-one" v-if="item.artists">
          <span v-for="(art, index) in item.artists" :key="art.id" v-html="art.name + `${index < item.artists.length - 1 ? '/' : ''}`"></span>
        </p>
      </div>
    </template>
  </el-col>
</template>
<style lang="scss" scoped>
.grid-list-item {
  // width: 18%;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  &.type-1 {
    &:nth-child(5n) {
      margin-right: 0;
    }

    > .el-image {
      min-height: 68px;
    }

    &:hover {
      .copy-writer {
        transform: translateY(0px);
      }

      .right {
        // display: none;
        opacity: 0;
      }
    }
  }
  .order {
    line-height: 42px;
    font-size: 12px;
    margin-right: 10px;
    // font-family: 微软雅黑;
  }

  .desc {
    position: absolute;
    bottom: 0;
    line-height: 24px;
    padding: 0 10px;
    width: 100%;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.3));
    // background-color: rgba(0, 0, 0, 0.5);
  }

  img {
    width: 100%;
    overflow: hidden;
  }

  .copy-writer,
  .right {
    position: absolute;
    top: 0px;
    box-sizing: border-box;
  }

  .copy-writer {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 8px 10px;
    line-height: 16px;
    font-size: 12px;
    width: 100%;
    left: 0;
    transform: translateY(-100%);
    overflow: hidden;
    transition: all 0.3s 0.5s;
    text-align: justify;
    z-index: 10;
  }

  .right {
    right: 10px;
    top: 0;
    max-width: 120px;
    line-height: 18px;
    padding: 0px 10px;
    opacity: 1;
    transition: all 0.1s 0.5s;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.3));

    .icon::after {
      color: $white;
    }
  }

  .creator {
    position: absolute;
    top: 0;
    left: 5px;
    padding-left: 10px;
    box-sizing: border-box;
    width: calc(100% - 10px);
    line-height: 30px;
    // background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.8));

    i::after {
      color: $white;
    }
  }
  .img {
    width: 100%;
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: $border-radius;
  }

  .name {
    font-size: 16px;
    line-height: 18px;
  }

  &.type-5 {
    min-height: 180px;
    min-width: 49%;

    &:nth-child(3n) {
      margin-right: 0;
    }

    .img {
      width: 100%;
      min-height: 180px;
      overflow: hidden;
    }

    .left {
      position: absolute;
      top: 5px;
      left: 5px;
      padding: 6px 7px;
      border-radius: 50px;
      background-color: rgba(0, 0, 0, 0.3);

      span::after {
        color: $white;
        font-size: 12px;
      }
    }
  }

  &.type-2 {
    width: 335px;
    height: 110px;

    // margin-right: 10px;
    // &:nth-child(2n) {
    //     margin-right: 0;
    // }
    // &:nth-child(5n) {
    //     margin-right: 10px;
    // }
    .img {
      width: 100px;
      height: 100px;
      float: left;
      position: relative;

      .time {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 10px;
        color: $white;
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.3));
        line-height: 20px;
      }
    }

    .text {
      margin-left: 10px;
      float: left;

      .name {
        font-size: 14px;
        margin-bottom: 10px;
      }

      span {
        width: 220px;
        font-size: 12px;
        line-height: 20px;
        color: $c-999;
        display: block;
      }

      .price {
        font-size: 14px;
        // font-family: 微软雅黑;
        font-weight: 400;
        margin-top: 10px;
      }
    }
  }

  // 视频列表
  &.type-3 {
    // width: 244px;
    // width: 32.4%;
    &:nth-child(3n) {
      margin-right: 0 !important;
    }

    .img {
      height: 180px;
      &:hover {
        .left {
          position: absolute;
          display: block;
          left: 50%;
          top: 50%;
        }
      }
    }

    .text {
      .name {
        margin-bottom: 5px;
      }

      .creator {
        color: $c-666;
      }
    }
  }

  &.type-4 {
    min-width: 50%;
    height: 132px;
    margin-right: 0;
    padding: 20px;
    margin-bottom: 0;
    border-right: 1px solid $c-e8;
    border-bottom: 1px solid $c-e8;
    box-sizing: border-box;

    &:nth-child(2n) {
      border-right: 0;
    }

    &:nth-child(9),
    &:nth-child(10) {
      border-bottom: 0;
    }

    .order {
      line-height: 92px;
      color: $c-666;
      font-style: italic;
      font-size: 18px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 25px;
        width: 6px;
        height: 1px;
        background-color: $c-666;
        left: 50%;
        margin-left: -3px;
      }
    }

    .img {
      width: 160px;
      height: 90px;
      float: left;
    }

    .text {
      padding-top: 10px;
      max-width: 140px;
      float: left;
      margin-left: 10px;

      .creator {
        position: relative;
        margin-top: 5px;
        padding-left: 0;
      }
    }
  }

  &.ftype-0 {
    // width: 380px;
    width: 100%;
    margin-bottom: 0;
    height: auto;
    margin-right: 0;

    .grid-list-item {
      padding: 10px;
      box-sizing: border-box;
      border: 0;
      height: 62px;

      &:hover {
        background-color: $c-ddd !important;
      }

      .img {
        height: 42px;
        width: 42px;
        margin-right: 10px;
        position: relative;

        .icon {
          position: absolute;
          left: 50%;
          margin-left: -10px;
          top: 50%;
          margin-top: -8px;

          &::after {
            font-size: 16px;
            padding: 4px;
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
      }

      .name {
        margin-bottom: 5px;
      }

      .singer {
        color: $c-999;
      }

      &:nth-child(even) {
        background-color: $c-eee;
      }
    }

    &:nth-child(1) {
      .grid-list-item {
        border-right: 1px solid $c-e8;
      }
    }

    &.type-1 {
      width: 50%;
    }
  }
}
</style>

<script>
import // ref,
// computed,
// watch,
// reactive,
// toRefs
// getCurrentInstance,
// onBeforeMount
// onMounted
'vue'
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    category: {
      type: Number,
      default: 3,
    },
    index: {
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      default: 1, // 3.视频列表,2.左右列表, 1.歌单列表
    },
  },
  setup(props) {
    // const state = reactive({
    //     item: {
    //         ...props
    //     }
    // })
    // console.log(props, state, 'state')
    // return {
    //     ...toRefs(state)
    // }
  },
}
</script>

