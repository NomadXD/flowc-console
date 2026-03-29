import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Base API URL - configure via environment variable
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

/**
 * Axios instance with base configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor to inject auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for centralized error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let React Query error handlers deal with errors
    return Promise.reject(error)
  }
)
