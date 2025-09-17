let apiUrl = 'https://api.boycot.top/api'
let musicApiUrl = 'https://music-api.boycot.top'
const env = import.meta.env.MODE
if (env === 'development') {
  // apiUrl = 'http://localhost:8090/api'
  // musicApiUrl = 'http://localhost:8090/music'
}
export { apiUrl, musicApiUrl }
