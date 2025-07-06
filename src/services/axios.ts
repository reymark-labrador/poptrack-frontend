import axios from "axios"

// Create Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Optional: Request interceptor (e.g., attach token)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") // or use Zustand/Auth store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Optional: Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralize error logging or redirect to login on 401
    if (error.response?.status === 401) {
      // Example: redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error)
  }
)

export default instance
