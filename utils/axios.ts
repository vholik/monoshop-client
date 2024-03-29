import { User } from '@store/types/user'
import axios from 'axios'

export const API_URL = process.env.NEXT_PUBLIC_API_URL!

const instance = axios.create({
  baseURL: API_URL
})

export const basicInstance = axios.create({
  baseURL: API_URL
})

export const logoutInstance = axios.create({
  baseURL: API_URL
})

logoutInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers!.Authorization = `Bearer ${token}`
  }

  return config
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers!.Authorization = `Bearer ${token}`
  }

  return config
})

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  fullName: string
  photo: string
  userId: number
}

instance.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<AuthResponse>(
          `${API_URL}/auth/refresh`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
            }
          }
        )
        console.log(response.data)
        localStorage.setItem('access_token', response.data.accessToken)
        localStorage.setItem('refresh_token', response.data.refreshToken)

        return instance.request(originalRequest)
      } catch (e) {
        console.log('Is not authorized after retry request')
      }
    }
    throw error
  }
)

export default instance
