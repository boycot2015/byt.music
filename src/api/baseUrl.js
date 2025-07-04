let apiUrl = 'https://api.boycot.top/api'
const env = import.meta.env.MODE
if (env === 'development') {
  apiUrl = 'http://localhost:8090/api'
}
export { apiUrl }
