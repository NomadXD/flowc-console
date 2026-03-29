import { apiClient } from '../client'
import type { GatewayPutRequest } from '../openapi/types'

export const gatewaysService = {
  list(labels?: string) {
    return apiClient.GET('/api/v1/gateways', {
      params: {
        query: { labels },
      },
    })
  },

  get(name: string) {
    return apiClient.GET('/api/v1/gateways/{name}', {
      params: { path: { name } },
    })
  },

  put(
    name: string,
    body: GatewayPutRequest,
    options?: { ifMatch?: number }
  ) {
    return apiClient.PUT('/api/v1/gateways/{name}', {
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
    return apiClient.DELETE('/api/v1/gateways/{name}', {
      params: {
        path: { name },
        header: { 'If-Match': options?.ifMatch },
      },
    })
  },
}
