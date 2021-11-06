import axios from '@/api/axios'
import urls from './urls'
// const headers = {}
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
            params
        })
    },
    /**
     * 参数 pageno=0&count=21&cids=0
     * @param {*} params
     */
    newestList (params) {
        params = { pageno: 0, count: 20, cids: 0, ...params }
        return axios.get(urls.newestList, {
            params
        })
    },
    /**
     * 参数 pageno=0&count=21&cids=0
     * @param {*} params
     */
    GetListByCategory (params) {
        params = { pageno: 0, count: 20, cids: 0, ...params }
        return axios.get(urls.GetListByCategory, {
            params
        })
    }
}
