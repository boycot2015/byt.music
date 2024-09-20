import { wallpaper } from '@/api/apiList'
// import {
//     // drag,
//     changeTheme
// } from '@/utils'
export default {
    namespaced: true,
    state: {
        // colors: [],
        // localBgUrls: [],
        picData: [],
        cateList: [],
        total: 0
    },
    mutations: {
        setData (state, data) {
            for (const key in data) {
                state[key] = data[key]
            }
        },
        setMoreData (state, data) {
            state.picData = [...state.picData, ...data.picData]
            state.total = data.total
        }
    },
    actions: {
        async getData ({ commit, dispatch }, params) {
            const cateList = await wallpaper.getCategory()
            const state = {}
            const newestList = await wallpaper.newestList(params)
            state.cateList = [{
                category: '最新',
                hot_tag: [],
                old_id: 0,
                position: '',
                show_name: '最新'
            }, ...cateList.data]
            state.picData = newestList.data.list
            state.total = newestList.data.total_count
            commit('setData', state)
            return Promise.resolve({ code: 200, success: true })
        },
        async getListByCategory ({ commit, dispatch }, params) {
            let newestList = []
            const state = {}
            if (params.old_id) {
                newestList = await wallpaper.GetListByCategory({ id: params.old_id, size: params.count })
            } else {
                newestList = await wallpaper.newestList({ page: params.pageno, size: params.count })
            }
            state.picData = newestList.data.list
            state.total = newestList.data.total_count
            commit('setData', state)
            return Promise.resolve({ code: 200, success: true })
        },
        async loadingMore ({ commit, dispatch }, params) {
            let newestList = []
            const state = {}
            if (params.old_id) {
                newestList = await wallpaper.GetListByCategory({
                    page: params.pageno,
                    id: params.old_id,
                    size: params.count
                })
            } else {
                newestList = await wallpaper.newestList({
                    page: params.pageno,
                    size: params.count
                })
            }
            state.picData = [...newestList.data.list]
            state.total = newestList.data.total_count
            commit('setMoreData', state)
            return Promise.resolve({ code: 200, success: true })
        }
    }
}
