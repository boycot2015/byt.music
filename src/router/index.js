import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/utils'
import routes from './modules'

const router = createRouter({
    history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL),
    routes
})
router.beforeEach((to, from, next) => {
    document.title = '网抑云音乐-' + to.meta.title
    const isLogin = store.get('userInfo') && store.get('cookie')
    // console.log(to.matched, 'to.matched')
    if (to.matched.length === 0) { // 匹配不到页面跳转首页
        next({ path: '/' })
        return
    }
    // if (to.path === '/common/page') {
    //     debugger
    //     next({ ...to, query: { ...to.query, activePath: from.path } })
    //     return
    // }
    if (!isLogin && to.meta.login && to.path !== '/error') { // 跳转登录页面
        if (to.path === '/songs/list' && !to.query.isDaily) {
            next()
            return
        }
        next({ path: '/error', query: { isLogin: true } })
        return
    }
    next()
})

export default router
