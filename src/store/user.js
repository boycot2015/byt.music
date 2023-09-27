import { user } from '@/api/apiList'
import { store } from '@/utils'
// import Cookies from 'js-cookie'
export default {
    namespaced: true,
    state: {
        lyricList: [],
        data: {
            total: 0,
            playLists: [],
            songs: [],
            hotComments: [], // 精彩评论
            comments: [] // 所有评论
        },
        cookie: store.get('cookie') || '',
        userInfo: (store.get('userInfo') !== null && store.get('userInfo')) || {
            account: {},
            profile: {},
            bindings: {},
            isSign: (store.get('userInfo') !== null && store.get('userInfo').isSign) || false // 是否签到
        }
    },
    mutations: {
        setData (state, data) {
            for (const key in data) {
                state.userInfo[key] = data[key] || {}
            }
            store.set('userInfo', data)
        },
        setCookie (state, data) {
            state.cookie = data
            store.set('cookie', data)
            // console.log(store.get('cookie'), 'state.cookie')
        },
        removeToken (state, data) {
            state.cookie = ''
            state.userInfo = {}
            store.remove('cookie')
            store.remove('userInfo')
        },
        setSign (state, data) {
            state.userInfo.isSign = data
            store.set('userInfo', state.userInfo)
        }
    },
    actions: {
        async loginByPhone ({ commit }, params) {
            return new Promise((resolve, reject) => {
                user.cellphone(params).then(res => {
                    if (res.code === 200) {
                        const { account = {}, profile = {}, bindings = {} } = res
                        commit('setCookie', res.cookie)
                        commit('setData', { account, profile, bindings })
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err => reject(err))
            })
        },
        async loginByQR ({ commit, dispatch }, res) {
            return new Promise((resolve, reject) => {
                if (res.code === 803) {
                    commit('setCookie', res.cookie)
                    // const { account, profile, bindings } = res
                    // commit('setData', { account, profile, bindings })
                    resolve(dispatch('getUserInfo', res))
                } else {
                    reject(res)
                }
            })
        },
        getUserInfo ({ commit }, data) {
            return new Promise((resolve, reject) => {
                user.account().then((params) => {
                    // params.account && user.detail({ uid: params.account.id }).then(res => {
                    //     const { account, profile, bindings, pcSign, mobileSign, ...others } = res || { account: params.account }
                    //     commit('setData', { account, profile, bindings, ...others })
                    //     commit('setSign', pcSign || mobileSign)
                    // }).catch(err => {
                    //     reject(err)
                    // })
                    if (params.account) {
                        const { account, profile, bindings, pcSign, mobileSign, ...others } = params
                        commit('setData', { account, profile, bindings, ...others })
                        commit('setSign', pcSign || mobileSign)
                        if (data.cookie) {
                            commit('setMenu', null, { root: true })
                            window.location.reload()
                        }
                        resolve(params)
                    } else {
                        reject(params)
                    }
                })
            })
        },
        logout ({ commit }, params) {
            return new Promise((resolve, reject) => {
                user.logout().then(res => {
                    if (res.code === 200) {
                        commit('removeToken')
                        commit('setMenu', null, { root: true })
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        sign ({ commit }, params) {
            return new Promise((resolve, reject) => {
                user.dailySignin().then(res => {
                    if (res && res.code === 200) {
                        commit('setSign', true)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}
