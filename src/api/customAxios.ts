import axios from 'axios'

const axiosClient = axios.create({
  timeout: 10 * 1000,
  withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
  config.headers["Accept"] = "application/json"
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // redirect to login page
        if (window.location.pathname !== '/login')
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient