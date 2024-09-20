import axios from '@/api/axios'
import urls from './urls'
// import { serveUrl } from '../baseUrl'
// const headers = {}
// const HttpsProxyAgent = require('https-proxy-agent')
export default {
    /**
     * 参数
     * source: Life Of Pix 、Unsplash、MMT、Realistic+Shots、
     * Jay+Mantri、Skitter+Photo、Startup+Stock+Photos、Barn+Images、Picography
     * page: 0
     *
     */
    list (params) {
        return axios.get(urls.list, {
            params
        })
    },
    /**
     * 参数 source=bing&page=0
     * @param {*} params
     */
    binglist (params) {
        return axios.get(urls.binglist, {
            params
        })
    },
    getCategory (params) {
        return axios.get(urls.getCategory, {
            params: {
                ...params,
                source: 'birdpaper'
            }
        }).then(res => {
            // console.log(res, '223')
            const cates = [
                ...res.data.cates.map(el => ({
                    category: el.name,
                    hot_tag: [],
                    old_id: el.id,
                    position: '',
                    show_name: el.name
                }))
            ]
            // console.log(res.catetoryData.imgList
            //     , '1232')
            /**
             * category: '最新',
                hot_tag: [],
                old_id: 0,
                position: '',
                show_name: '最新'
             */
            return { data: cates, code: 200, success: true }
        })
    },
    /**
     * 参数 pageno=0&count=21&cids=0
     * @param {*} params
     */
    newestList (params) {
        params = { pageno: 0, count: 20, cids: 0, ...params }
        return axios.get(urls.newestList, {
            params: {
                ...params,
                source: 'birdpaper'
            }
        }).then(res => {
            return { data: { ...res.data, list: res.data.list.map(el => ({ id: el.id, url: el.img })) } }
        })
    },
    /**
     * 参数 pageno=0&count=21&cids=0
     * @param {*} params
     */
    GetListByCategory (params) {
        params = { pageno: 0, count: 20, id: params.cids, ...params }
        return axios.get(urls.GetListByCategory, {
            params: {
                ...params,
                source: 'birdpaper'
            }
        }).then(res => {
            // console.log(res, '223')
            return { data: { ...res.data, list: res.data.list.map(el => ({ id: el.id, url: el.img })) } }
        })
    },
    unsplashList (params) {
        params = { per_page: params.count || 20, page: params.pageno || 1 }
        return axios.get(urls.unsplashList, {
            params
        })
    }
}
