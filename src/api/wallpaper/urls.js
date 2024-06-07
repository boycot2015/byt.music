// import baseUrl from '../baseUrl'
import { apiUrl } from '@/api/baseUrl'
const baseUrl = 'https://api.boycot.top/api'
export default {
    list: baseUrl + '/infinity/get-wallpaper', // 全球知名高品质壁纸
    binglist: baseUrl + '/bing/list', // 必应每日壁纸
    getCategory: baseUrl + '/wallpaper', // 热门分类
    newestList: baseUrl + '/wallpaper', // 最新360壁纸
    GetListByCategory: baseUrl + '/wallpaper', // 根据分类获取360壁纸
    unsplashList: apiUrl + '/wallpaper' // unsplashList壁纸
}
