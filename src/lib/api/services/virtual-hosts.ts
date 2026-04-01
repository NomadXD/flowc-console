import { apiClient } from '../client'
import type { VirtualHostPutRequest } from '../openapi/types'

export type VirtualHostListParams = {
  labels?: string
  gatewayRef?: string
  listenerRef?: string
}

export const virtualHostsService = {
  list(params?: VirtualHostListParams) {
    return apiClient.GET('/api/v1/virtualhosts', {
      params: {
        query: params,
      },
    })
  },

  get(name: string) {
    return apiClient.GET('/api/v1/virtualhosts/{name}', {
      params: { path: { name } },
    })
  },

  put(
    name: string,
    body: VirtualHostPutRequest,
    options?: { ifMatch?: number }
  ) {
    return apiClient.PUT('/api/v1/virtualhosts/{name}', {
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
    return apiClient.DELETE('/api/v1/virtualhosts/{name}', {
      params: {
        path: { name },
        header: { 'If-Match': options?.ifMatch },
      },
    })
  },
}
