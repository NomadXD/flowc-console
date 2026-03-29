import { apiClient } from '../client'

export const healthService = {
  check() {
    return apiClient.GET('/health')
  },
}
