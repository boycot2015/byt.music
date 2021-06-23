<template>
    <div class="comment">
        <template v-if="data.hotComments && data.hotComments.length">
            <h2 class="title">{{title}}<span>(已有{{data.total}}条评论)</span></h2>
            <h3 class="title">精彩评论({{data.hotComments.length}})</h3>
            <div v-for="hotComment in data.hotComments" :key="hotComment.id" class="comment-item clearfix">
                <div class="avatar fl">
                    <img :src="hotComment.user.avatarUrl" alt="">
                </div>
                <div class="text fl">
                    <p class="name">
                        {{hotComment.user.nickname}}:
                        <span class="desc">{{hotComment.content}}</span>
                    </p>
                    <template v-if="hotComment.beReplied.length">
                        <p class="name reply" v-for="beReplied in hotComment.beReplied" :key="beReplied.id">
                            @{{beReplied.user.nickname}}:
                            <span class="desc">{{beReplied.content}}</span>
                        </p>
                    </template>
                    <div class="info flexbox-h just-b">
                        <span class="time flex-1 tl">{{hotComment.time}}</span>
                        <div class="right flex-3 tr">
                            <span class="star">
                                <i class="icon-music-star" :class="{active: hotComment.liked}" @click="star(hotComment)"></i>
                                <i class="num" v-if="hotComment.likedCount">({{hotComment.likedCount}})</i>
                            </span>
                            <span class="share">分享</span>
                            <span class="repeat">回复</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="data.comments && data.comments.length">
            <h3 class="title">最新评论({{data.total - data.hotComments.length}})</h3>
            <div v-for="comment in data.comments" :key="comment.id" class="comment-item clearfix">
                <div class="avatar fl">
                    <img :src="comment.user.avatarUrl" alt="">
                </div>
                <div class="text fl">
                    <p class="name">
                        {{comment.user.nickname}}：
                        <span class="desc">{{comment.content}}</span>
                    </p>
                    <template v-if="comment.beReplied.length">
                        <p class="name reply" v-for="beReplied in comment.beReplied" :key="beReplied.id">
                            @{{beReplied.user.nickname}}:
                            <span class="desc">{{beReplied.content}}</span>
                        </p>
                    </template>
                    <div class="info flexbox-h just-b">
                        <span class="time flex-1 tl">{{comment.time}}</span>
                        <div class="right flex-3 tr">
                            <span class="star">
                                <i class="icon-music-star" :class="{active: comment.liked}" @click="star(comment)"></i>
                                <i class="num" v-if="comment.likedCount">({{comment.likedCount}})</i>
                            </span>
                            <span class="share">分享</span>
                            <span class="repeat">回复</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>

import {
    reactive,
    toRefs,
    onMounted,
    onBeforeMount,
    inject
} from 'vue'
import {
    useStore
} from 'vuex'
import { comment } from '@/api/apiList'
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        title: {
            type: String,
            default: '听友评论'
        }
    },
    setup (props) {
        const store = useStore()
        const rootStore = store.state
        const detailStore = rootStore.detail.songDetail
        const state = reactive({
            data: props.data,
            title: props.title,
            loading: true,
            currLyric: detailStore.currLyric || {}, // 当前播放的歌词
            playData: rootStore.playData
        })
        // const { ctx } = getCurrentInstance()
        onBeforeMount(async () => {
        })
        onMounted(() => {
        })
        const showToast = inject('showToast')
        const star = (row) => {
            row.liked = !row.liked
            comment.like({ id: state.playData.id, cid: row.commentId, t: Number(row.liked), type: 0 }).then(res => {
                console.log(state.playData, 'showToast')
                if (res.code === 200) {
                    row.liked && row.likedCount++
                    !row.liked && row.likedCount--
                    return
                }
                showToast({
                    text: res.msg,
                    showWrap: true, // 是否显示组件
                    showContent: true // 作用:在隐藏组件之前,显示隐藏动画
                })
            }).catch(err => {
                showToast({
                    text: err.msg,
                    showWrap: true, // 是否显示组件
                    showContent: true // 作用:在隐藏组件之前,显示隐藏动画
                })
            })
            // id=29178366&cid=12840183&t=1&type=0
        }
        return {
            ...toRefs(state),
            star
        }
    },
    methods: {
    }
}
</script>

<style>

</style>
