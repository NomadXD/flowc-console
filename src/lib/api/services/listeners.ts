import { apiClient } from '../client'
import type { ListenerPutRequest } from '../openapi/types'

export const listenersService = {
  list(labels?: string) {
    return apiClient.GET('/api/v1/listeners', {
      params: {
        query: { labels },
      },
    })
  },

  get(name: string) {
    return apiClient.GET('/api/v1/listeners/{name}', {
      params: { path: { name } },
    })
  },

  put(
    name: string,
    body: ListenerPutRequest,
    options?: { ifMatch?: number }
  ) {
    return apiClient.PUT('/api/v1/listeners/{name}', {
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
    return apiClient.DELETE('/api/v1/listeners/{name}', {
      params: {
        path: { name },
        header: { 'If-Match': options?.ifMatch },
      },
    })
  },
}
