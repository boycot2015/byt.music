<template>
    <div class="comment">
        <h2 class="title">{{title}}<span>(已有{{data.total}}条评论)</span></h2>
        <template v-if="data.hotComments && data.hotComments.length">
            <h3 class="title">精彩评论({{data.hotComments.length}})</h3>
            <div v-for="hotComment in data.hotComments" :key="hotComment.id" class="comment-item flexbox-h">
                <div class="avatar">
                    <img :src="hotComment.user.avatarUrl" alt="">
                </div>
                <div class="text flex-4">
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
                            <span class="star" @click="star(hotComment)">
                                <i class="icon-music-star" :class="{active: hotComment.liked}"></i>
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
            <div v-for="comment in data.comments" :key="comment.id" class="comment-item flexbox-h">
                <div class="avatar">
                    <img :src="comment.user.avatarUrl" alt="">
                </div>
                <div class="text flex-4">
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

<style lang="less" scoped>
.comment {
    // padding: 0 50px;
    // padding-right: 50px;
    h2.title {
        font-size: 18px;
        color: #333333;
        font-family: 微软雅黑;
        padding-bottom: 10px;
        border-bottom: 1px solid #e8e8e8;
        span {
            padding-left: 10px;
            font-size: 12px;
            color: @c-999;
        }
    }
    h3.title {
        font-size: 14px;
        line-height: 36px;
        margin-top: 30px;
        border-bottom: 1px solid @c-e8;
    }
    &-item {
        padding: 20px 0;
        align-items: flex-start;
        border-bottom: 1px solid @c-e8;
        &:last-child {
            border-bottom: 0;
        }
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 40px;
            overflow: hidden;
            margin-right: 10px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .text {
            // width: 500px;
            .name {
                // min-width: 120px;
                font-size: 12px;
                line-height: 20px;
                text-align: justify;
                color: #0C73C2;
                user-select: text;
                .desc {
                    color: @c-333;
                }
                &.reply {
                    margin-top: 10px;
                    background-color: #F1F1F4;
                    padding: 5px 10px;
                    border-radius: 3px;
                }
            }
            .info {
                margin-top: 5px;
                color: @c-999;
                .right {
                    span {
                        cursor: pointer;
                        padding: 0 6px;
                        border-right: 1px solid @c-ccc;
                        &:last-child {
                            border-right: 0;
                        }
                    }
                }
            }
        }
    }
    .icon-music-star.active::after {
        color: @primary;
    }
}
</style>
