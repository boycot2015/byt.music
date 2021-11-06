// import baseUrl from '../baseUrl'
const baseUrl = 'https://api.codelife.cc'
export default {
    list: baseUrl + '/infinity/get-wallpaper', // 全球知名高品质壁纸
    binglist: baseUrl + '/bing/list', // 必应每日壁纸
    getCategory: baseUrl + '/birdpaper/intf/getCategory', // 热门分类
    newestList: baseUrl + '/birdpaper/intf/newestList', // 最新360壁纸
    GetListByCategory: baseUrl + '/birdpaper/intf/GetListByCategory' // 根据分类获取360壁纸

}
