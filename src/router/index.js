import { createRouter, createWebHistory } from 'vue-router'
import Error from '@/views/error.vue'
import { useConfigStore } from '@/stores/config'
import NProgress from 'nprogress'

NProgress.configure({ parent: '.el-main', showSpinner: false })
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/playlist',
      component: Error,
      meta: {
        title: '首页',
      },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('@/views/AboutView.vue'),
    //   meta: {
    //     title: '关于',
    //   },
    // },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search/index.vue'),
      meta: {
        title: '搜索',
        keepAlive: true,
        icon: 'Search',
      },
    },
    {
      path: '/playlist',
      name: 'playlist',
      component: () => import('@/views/playlist/index.vue'),
      meta: {
        title: '歌单',
        icon: 'icon-favicon',
        keepAlive: true,
      },
    },
    {
      path: '/playlist/:id',
      name: 'playlistDetail',
      component: () => import('@/views/playlist/detail.vue'),
      meta: {
        title: '歌单详情',
        icon: 'icon-favicon',
        menuPath: '/playlist',
        hideInMenu: true,
        showBack: true,
      },
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('@/views/ranking/index.vue'),
      meta: {
        title: '排行榜',
        keepAlive: true,
        icon: 'IconRank',
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/favorites/index.vue'),
      meta: {
        title: '收藏',
        keepAlive: true,
        icon: 'IconHeart',
      },
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('@/views/app/index.vue'),
      meta: {
        title: '应用',
        keepAlive: true,
        icon: 'IconApp',
      },
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/setting/index.vue'),
      meta: {
        title: '设置',
        keepAlive: true,
        icon: 'Setting',
      },
    },
    {
      path: '/:catchAll(.*)*',
      name: 'notFound',
      component: Error,
      props: true,
    },
  ],
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  const { config } = useConfigStore()
  document.title = to.meta.title + '-' + (config.title || 'BytMusic')
  next()
})
router.afterEach(() => {
  NProgress.done()
})
export default router
