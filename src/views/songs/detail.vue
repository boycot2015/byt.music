<template>
<div class="song-detail active flexbox-v">
    <div class="scroll-view" ref="scrollDom">
        <div class="top flexbox-h just-c">
            <div class="handler" :class="{'active': !playData.paused}">
                <div class="point"></div>
                <div class="line-1"></div>
                <div class="line-2"></div>
                <div class="line-3"></div>
                <div class="header-cap"></div>
            </div>
            <div class="mask" :style="{backgroundImage: `url(${playData.picUrl})`}"></div>
            <div class="cover" :class="{'active play': !playData.paused, 'active pause': playData.paused}">
                <div class="img">
                    <img :src="playData.picUrl" alt="">
                </div>
            </div>
            <!-- 音乐跳动 -->
            <music-byte class="music-dance"></music-byte>
            <div class="lyric-text-content">
                <div class="info">
                    <div class="song-info flexbox-h">
                        <p class="name">
                            {{playData.name}}
                            <span class="level red bd-red pad2 font12">{{playData.level === 'exhigh' ?'标准音质':'极高音质'}}</span>
                            <span v-if="playData.type" class="type red bd-red pad2 font12">{{playData.type.toUpperCase()}}</span>
                        </p>
                    </div>
                    <div class="single-info flexbox-h">
                        <span class="al-name line-one flex-1" title="{{playData.alName}}">专辑：<i>{{playData.alName}}</i></span>
                        <span class="al-name line-one flex-1" title="{{playData.singer}}">歌手：<i>{{playData.singer}}</i></span>
                        <span class="al-name line-one flex-1" title="{{playData.alName}}">来源：<i>{{playData.alName}}</i></span>
                    </div>
                    <i class="icon-music-minify icon-minify" @click="onTurnBack"></i>
                </div>
                <div class="wrap" ref="lyricScrollDom">
                    <div class="lyric-text">
                        <template v-if="lyricList && lyricList.length">
                            <p
                            v-for="item in lyricList" :key="item.id"
                            :class="{'active': currLyric.time === item.time}"
                            class="lyric-text-item">
                            {{item.text}}
                            </p>
                        </template>
                        <p class="lyric-text-item " v-else data-time="">暂无歌词~</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom flexbox-h">
            <div class="comment-content flex-2" v-loading="loading">
                <comment :data="data"></comment>
            </div>
            <div class="same-content flex-1">
                <div class="same-play-list grid-list">
                    <h2 class="title">包含这首歌的歌单</h2>
                    <template v-if="data.playLists && data.playLists.length">
                        <div v-for="item in data.playLists" :key="item.id" @click="onItemlistClick(item, 1)" class="grid-list-item ftype-0 ">
                            <div class="same-play-list-item grid-list-item js-list-detail ftype-0" data-id="{{item.id}}" data-type="{{item.type}}">
                                <div class="img fl">
                                    <span class="icon icon-music-pause"></span>
                                    <img :src="item.coverImgUrl" alt="">
                                </div>
                                <div class="text fl" :title="item.rcmdtext || item.name">
                                    <p class="name line-one">{{item.name}}</p>
                                    <span class="play-count singer">播放：{{item.playCount}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="same-music-list grid-list" v-if="data.songs && data.songs.length">
                    <h2 class="title">相似歌曲</h2>
                    <div v-for="item in data.songs" @click="onItemlistClick(item, 2)" :key="item.id" class="grid-list-item ftype-0">
                        <div class="same-play-list-item grid-list-item js-list-detail ftype-0">
                            <div class="img fl">
                                <span class="icon icon-music-pause"></span>
                                <img :src="item.album.picUrl" alt="">
                            </div>
                            <div class="text fl" :title="item.rcmdtext || item.name">
                                <p class="name line-one">{{item.name}}</p>
                                <span v-for="(singer, index) in item.album.artists" :key="singer.id" class="singer" v-html="singer.name + (index < item.album.artists.length - 1 ? '/': '')">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- v-if="scrollTop > clientHeight"  -->
    <to-top selector=".scroll-view"></to-top>
    <!-- <div class="fix-top" :class="{show: scrollTop > clientHeight, hide: scrollTop <= clientHeight}" @click="scrollToTop">返回顶部</div> -->
</div>
</template>

<script>
import {
    ref,
    // computed,
    watch,
    reactive,
    toRefs,
    // getCurrentInstance,
    onMounted,
    onBeforeMount
} from 'vue'
import {
    useStore
} from 'vuex'
import {
    useRouter
} from 'vue-router'
import { animate } from '@/utils'
import Comment from '@/views/components/comment'
export default {
    components: {
        Comment
    },
    setup (props, { emit }) {
        const store = useStore()
        const rootStore = store.state
        const detailStore = rootStore.detail.songDetail
        const router = useRouter()
        const lyricScrollDom = ref(null)
        const scrollDom = ref(null)
        const state = reactive({
            lyricList: [],
            data: {
                total: 0,
                hasMore: true,
                hotComments: [], // 精彩评论
                comments: [], // 所有评论
                playLists: [],
                songs: []
            },
            swiperOption: {
                direction: 'vertical', // 垂直切换选项
                // slidesPerView: 1,
                // spaceBetween: -40,
                slidesPerView: 40,
                slidesPerGroup: 40,
                // autoplay: {
                //     delay: 5000,
                //     disableOnInteraction: false
                // },
                speed: 400
            },
            limit: 50,
            offset: 0,
            loading: true,
            scrollTop: 0,
            clientHeight: 0,
            currLyric: detailStore.currLyric || {}, // 当前播放的歌词
            playData: rootStore.playData
        })
        // const { ctx } = getCurrentInstance()
        onBeforeMount(async () => {
        })
        watch(() => [
            detailStore.lyricList,
            detailStore.data.hotComments,
            detailStore.data.comments,
            rootStore.playData,
            detailStore.data.total,
            detailStore.data.playLists,
            detailStore.data.songs
        ], (value) => {
            if (state.offset) {
                if (detailStore.data.total >= state.data.comments.length) {
                    state.data.comments = [...state.data.comments, ...value[2]]
                }
                return
            }
            state.lyricList = value[0]
            state.data.hotComments = value[1]
            state.playData = value[3]
            state.data.total = value[4]
            state.data.playLists = value[5]
            state.data.songs = value[6]
            state.data.comments = value[2]
        })
        watch(() => rootStore.playData.url, (value) => {
            lyricScrollDom.value.scrollTop = 0
            scrollDom.value.scrollTop = 0
            state.offset = 0
        })
        watch(() => detailStore.currLyric, (value) => {
            state.currLyric = value
            state.lyricList.map((el, index) => {
                if (value.time === el.time) {
                    if (index > 5 && index < state.lyricList.length - 5) {
                        const offsetHeight = lyricScrollDom.value.children[0].children[0].offsetHeight
                        animate(lyricScrollDom.value, offsetHeight * (index - 5), 'scrollTop', 1)
                    } else {
                        clearInterval(lyricScrollDom.value.timer)
                    }
                }
            })
        })
        watch(() => detailStore.songParams, (value) => {
            const params = { id: value.id, type: state.type, limit: state.limit, offset: state.offset }
            getData(params)
        })
        onMounted(() => {
            const params = { id: detailStore.songParams.id, type: state.type, limit: state.limit, offset: state.offset }
            if (!params.id) {
                state.loading = false
                return
            }
            getData(params)
            document.querySelector('.scroll-view').addEventListener('scroll', function (e) {
                // 获取定义好的scroll盒子
                // const el = scrollDom.value
                state.scrollTop = this.scrollTop
                state.clientHeight = this.clientHeight
                const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
                if (condition && !state.loading && detailStore.data.hasMore && detailStore.data.total >= state.data.comments.length) {
                    state.offset++
                    getData({ ...params, offset: state.offset, limit: state.limit, type: state.type })
                }
            })
        })
        // methods
        const getData = async (params) => {
            if (state.offset > 0) {
                state.loading = true
                await store.dispatch('detail/getCommentByPage', params).then(res => {
                    state.loading = false
                })
                return
            }
            await store.dispatch('detail/getsongData', params).then(res => {
                // initSwiper()
                state.currLyric = state.lyricList[0] || {}
                lyricScrollDom.value.scrollTop = 0
                scrollDom.value.scrollTop = 0
                state.loading = false
            })
        }
        const onItemlistClick = (item, type) => {
            if (type === 2) {
                store.dispatch('setPlayData', item)
                getData(item)
                store.dispatch('detail/setSongPlayer', {
                    id: item.id || item.vid || item.mvid,
                    show: true
                })
            } else {
                router.push({
                    path: '/songs/list',
                    query: {
                        id: item.id
                    }
                })
            }
        }
        // const initSwiper = () => {
        //     /* eslint-disable */
        //     new Swiper('.lyric-swiper-container', state.swiperOption)
        // }
        const onTurnBack = () => {
            store.dispatch('detail/setSongPlayerShow', false)
        }
        const scrollToTop = () => {
            scrollDom.value.scrollTop = 0
        }
        return {
            ...toRefs(state),
            router,
            lyricScrollDom,
            scrollDom,
            onTurnBack,
            onItemlistClick,
            scrollToTop
        }
    }
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

/* .scale-fade-leave-active for below version 2.1.8 */
    {
    transform:scale(0.5);
    transform-origin: 80px 200px;
    opacity: 0;
}
.music-dance {
    position:absolute;
    bottom:0px;
    left:70px;
    z-index: 1;
    /* width: 100%; */
}
</style>
