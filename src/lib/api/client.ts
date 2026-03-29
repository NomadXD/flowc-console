import createClient from 'openapi-fetch'
import type { paths } from './openapi/schema'
import { useAuthStore } from '@/stores/auth-store'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const apiClient = createClient<paths>({
  baseUrl: BASE_URL,
})

apiClient.use({
  async onRequest({ request }) {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    request.headers.set('X-Managed-By', 'flowc-console')
    return request
  },
})
