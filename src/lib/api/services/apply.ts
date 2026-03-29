import { apiClient } from '../client'
import type { ApplyRequest } from '../openapi/types'

export const applyService = {
  apply(body: ApplyRequest) {
    return apiClient.POST('/api/v1/apply', {
      body,
    })
  },
}
