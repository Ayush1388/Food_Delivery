import axios from "axios"

export const getToken = () => localStorage.getItem("adminToken") || ""
export const setToken = (t) => localStorage.setItem("adminToken", t)
export const clearToken = () => localStorage.removeItem("adminToken")

// Attach the admin token to every request; on 401, force a fresh login.
axios.interceptors.request.use((config) => {
  config.headers.token = getToken()
  return config
})
axios.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      window.location.assign("/login")
    }
    return Promise.reject(error)
  }
)
