// 根据不同的环境设定不同的baseUrl，

// let baseUrl = 'http://music.api.boycot.top' // 本地代理
let baseUrl = 'http://music.api.boycot.top' // 本地代理
const apiUrl = 'http://api.boycot.top/api' // 本地代理
let loginUrl, serveUrl
const env = process.env.NODE_ENV === 'development'
    ? 'development' : process.env.VUE_APP_TITLE === 'show'
        ? 'show' : process.env.VUE_APP_TITLE === 'test'
            ? 'test' : process.env.VUE_APP_TITLE === 'test219'
                ? 'test219' : process.env.VUE_APP_TITLE === 'app.test'
                    ? 'app.test' : 'production'
switch (env) {
case 'development':
    // baseUrl = '/api'
    // apiUrl = 'http://localhost:8090/api' // 本地代理
    serveUrl = 'http://192.168.31.107:8080'
    break
case 'test':
    baseUrl = 'http://music.api.boycot.top'
    serveUrl = 'http://music.boycot.top'
    break
case 'show':
    baseUrl = 'http://music.api.boycot.top'
    serveUrl = 'http://music.boycot.top'
    break
case 'production':
    baseUrl = 'http://music.api.boycot.top'
    // baseUrl = 'https://boycot-music-api.vercel.app'
    serveUrl = 'http://music.boycot.top'
    break
}
export default baseUrl
export { loginUrl, apiUrl, serveUrl }
