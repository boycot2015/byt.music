import { video, MV } from '@/api/index.js'
import { filterPlayCount } from '@/utils'
import { defineStore } from 'pinia'
const expires = 1000 * 60 * 60 // 有效期1小时
export const useVideoStore = defineStore('video', {
    state: () => ({
        expires: Date.now() + expires,  // 有效期
        tab1Data: {
            all: {},
            categories: [], // 分类
            tags: [], // 分类
            subs: [], // 分类
            list: []
        },
        tab2Data: {
            personalized: [], // 推荐歌单列表
            // privatecontent: [], // 独家放送列表
            // topSong: [], // 新歌速递列表
            // mv: [], // 推荐 mv
            // djprogram: [], // 最热主播榜
            // djrecommend: [] // 最热主播榜
            hotMV: [],
            exclusive: [],
            topMV: []
        },
        videoDetail: {
            total: 0,
            hasMore: true,
            countData: {},
            playData: {},
            hotComments: [], // 精彩评论
            comments: [], // 所有评论
            videos: []
        },
        videoParams: {},
        showVideoPlayer: false
    }),
    actions: {
        async getTab1Data (params) {
            const data = {}
            const catlistRes = await video.groupList(params)
            // const allVideosRes = await video.all(params)
            // const categoryRes = await video.category(params)
            if (catlistRes && catlistRes.code === 200) {
                const subs = []
                const categories = {
                    0: '全部视频'
                }
                for (const key in categories) {
                    subs[key] = []
                    catlistRes.data.map(el => {
                        subs[key].push(el)
                    })
                }
                data.subs = subs
                data.categories = categories
            }
            // if (allVideosRes && allVideosRes.code === 200) {
            //     allVideosRes.datas.map(el => {
            //         el.data.playTime = filterPlayCount(el.data.playTime)
            //         el.data.playCount = filterPlayCount(el.data.playCount)
            //     })
            //     data.list = allVideosRes.datas
            // }
            // if (categoryRes && categoryRes.code === 200) {
            //     data.tags = categoryRes.data
            // }
            for (const key in data) {
                this.tab1Data[key] = data[key]
            }
            return Promise.resolve({ code: 200, success: true })
        },
        async getTab2Data (params) {
            if(Date.now() < this.expires && this.tab2Data.personalized.length) return
            if (Date.now() > this.expires) {
                this.expires = Date.now() + expires
            }
            const firstRes = await MV.first(params)
            const hotMVRes = await MV.all(params)
            const exclusiveRes = await MV.exclusive(params)
            const topMVRes = await MV.all(params)
            const data = {}
            firstRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            hotMVRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            exclusiveRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            topMVRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            data.personalized = (firstRes && firstRes.data) || []
            data.topMV = (topMVRes && topMVRes.data) || []
            data.exclusive = (exclusiveRes && exclusiveRes.data?.slice(0, 16)) || []
            let res = (hotMVRes && hotMVRes.data) || []
            res = hotMVRes.data?.slice(0, 16)
            data.hotMV = res
            for (const key in data) {
                this.tab2Data[key] = data[key]
            }
            return Promise.resolve({ code: 200, success: true })
        },
        // 根据分类标签获取列表数据
        getVideoByParams ({
            offset = 0,
            limit = 9,
            ctype = 1,
            order = 1,
            type = '游戏',
            ...ohters
        }) {
            this.expires = null
            return new Promise((resolve, reject) => {
                let api = 'first'
                let apiStr = 'personalized'
                // console.log(ctype, 'ctype')
                let isPage = false
                switch (+ctype) {
                case 1:
                    api = 'first'
                    apiStr = 'personalized'
                    break
                case 2:
                    api = 'all'
                    apiStr = 'hotMV'
                    break
                case 3:
                    api = 'exclusive'
                    apiStr = 'exclusive'
                    isPage = true
                    break
                case 5:
                    api = 'top'
                    apiStr = 'topMV'
                    isPage = true
                    break
                default:
                    break
                }
                if (!isPage && offset != 0) {
                    return resolve({ code: 200, data: offset != 0 ? [] : this.tab2Data[apiStr] || [], more: false, success: true })
                }
                MV[api]({
                    limit,
                    offset: offset * limit,
                    type,
                    order,
                    ...ohters
                }).then(res => {
                    const data = {}
                    if (res && res.code === 200) {
                        res.data.map(el => {
                            el.playTime = filterPlayCount(el.playTime)
                            el.score = filterPlayCount(el.score)
                            el.playCount = filterPlayCount(el.playCount)
                        })
                        data[apiStr] = res.data
                        if (offset == 0) {
                            for (const key in data) {
                                this.tab2Data[key] = data[key]
                            }
                        }
                        resolve({ code: 200, data: res.data, more: res.more, success: true })
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 根据分类标签获取列表数据
        getListByCate ({ offset = 0, id }) {
            this.expires = null
            return new Promise((resolve, reject) => {
                let api = 'group'
                if (!id) {
                    api = 'all'
                }
                video[api]({ limit: 9, order: 'hot', id, offset: offset * 9 }).then(res => {
                    if (res && res.code === 200) {
                        res.datas.map(el => {
                            el.data.playTime = filterPlayCount(el.data.playTime)
                            el.data.playCount = filterPlayCount(el.data.playCount)
                        })
                        this.tab1Data.list = res.datas
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        setVideoPlayer (val) {
            this.videoParams = val
            this.tab2Data.playData = {...this.tab2Data.playData, ...val}
        },
        setVideoPlayerShow (val) {
            this.showVideoPlayer = val
        },
        async getVideoData (params) {
            const state = {
                total: 0,
                countData: {},
                videos: [],
                hotComments: [], // 精彩评论
                comments: [], // 所有评论
                playData: {}
            }
            const videoRes = params.type === 'mv' ? await MV.detail({ mvid: params.id }) : await video.detail(params)
            const videoInfoRes = params.type === 'mv' ? await MV.info({ mvid: params.id }) : await video.info({ vid: params.id })
            // const videoCommentRes = await video.comment({ id: params.id })
            const relatedRes = await video.related({ id: params.id })
            let videoUrlRes = params.type === 'mv' ? await MV.url({ id: params.id }) : await video.url({ id: params.id })
            if (videoRes && videoRes.code === 200) {
                state.playData = videoRes.data
                state.playData.playCount = filterPlayCount(state.playData.playCount)
                state.playData.playTime = filterPlayCount(state.playData.playTime)
            }
            if (videoInfoRes && videoInfoRes.code === 200) {
                state.countData = videoInfoRes
            }
            // if (videoCommentRes && videoCommentRes.code === 200) {
            //     state.comments = videoCommentRes.comments
            //     state.hotComments = videoCommentRes.hotComments
            //     state.total = videoCommentRes.total
            // }
            if (relatedRes && relatedRes.code === 200) {
                state.videos = relatedRes.data
                state.videos.map(el => {
                    el.playCount = filterPlayCount(el.playCount)
                    el.playTime = filterPlayCount(el.playTime)
                })
            }
            if (videoUrlRes && videoUrlRes.code === 200) {
                videoUrlRes = videoUrlRes.urls ? videoUrlRes.urls[0] : videoUrlRes.data
                state.playData = { ...state.playData, ...videoUrlRes }
            }
            // console.log(state, 'state')
            for (const key in state) {
                this.videoDetail[key] = state[key]
            }
            return Promise.resolve({ code: 200, success: true })
        },
        async getVideoCommentByPage (params) {
            const videoCommentRes = await video.comment(params)
            if (videoCommentRes && videoCommentRes.code === 200) {
                this.videoDetail.total = videoCommentRes.total
                this.videoDetail.hasMore = videoCommentRes.more
                this.videoDetail.comments = videoCommentRes.comments
                return Promise.resolve({ code: 200, success: true })
            }
        },
    },
    persist: {
        enabled: true
    }
})
