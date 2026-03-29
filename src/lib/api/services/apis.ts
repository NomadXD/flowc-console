import { apiClient } from '../client'
import type { APIPutRequest } from '../openapi/types'

export const apisService = {
  list(labels?: string) {
    return apiClient.GET('/api/v1/apis', {
      params: {
        query: { labels },
      },
    })
  },

  get(name: string) {
    return apiClient.GET('/api/v1/apis/{name}', {
      params: { path: { name } },
    })
  },

  put(
    name: string,
    body: APIPutRequest,
    options?: { ifMatch?: number }
  ) {
    return apiClient.PUT('/api/v1/apis/{name}', {
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
    return apiClient.DELETE('/api/v1/apis/{name}', {
      params: {
        path: { name },
        header: { 'If-Match': options?.ifMatch },
      },
    })
  },
}
