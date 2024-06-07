// 根据不同的环境设定不同的baseUrl，

// let baseUrl = 'https://music-api.boycot.top' // 本地代理
let baseUrl = 'https://music-api.boycot.top' // 本地代理
const apiUrl = 'https://api.boycot.top/api' // 本地代理
// const apiUrl = 'https://119.29.254.62:4000/api' // 本地代理
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
    // apiUrl = 'https://localhost:8090/api' // 本地代理
    baseUrl = 'https://music-api.boycot.top'
    serveUrl = 'https://music.boycot.top'
    break
case 'test':
    baseUrl = 'https://music-api.boycot.top'
    serveUrl = 'https://music.boycot.top'
    break
case 'show':
    baseUrl = 'https://music-api.boycot.top'
    serveUrl = 'https://music.boycot.top'
    break
case 'production':
    baseUrl = 'https://music-api.boycot.top'
    serveUrl = 'https://music.boycot.top'
    break
}
export default baseUrl
export { loginUrl, apiUrl, serveUrl }
