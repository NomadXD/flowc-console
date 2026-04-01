import { apiClient } from '../client'
import type { GatewayProfilePutRequest } from '../openapi/types'

export const gatewayProfilesService = {
  list(labels?: string) {
    return apiClient.GET('/api/v1/gatewayprofiles', {
      params: {
        query: { labels },
      },
    })
  },

  get(name: string) {
    return apiClient.GET('/api/v1/gatewayprofiles/{name}', {
      params: { path: { name } },
    })
  },

  put(
    name: string,
    body: GatewayProfilePutRequest,
    options?: { ifMatch?: number }
  ) {
    return apiClient.PUT('/api/v1/gatewayprofiles/{name}', {
      params: {
        path: { name },
        header: {
          'If-Match': options?.ifMatch,
        },
      },
      body,
    })
  },

  delete(name: string, options?: { ifMatch?: number }) {
    return apiClient.DELETE('/api/v1/gatewayprofiles/{name}', {
      params: {
        path: { name },
        header: { 'If-Match': options?.ifMatch },
      },
    })
  },
}
