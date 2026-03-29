import { apiClient } from '../client'
import type { DeploymentPutRequest } from '../openapi/types'

export const deploymentsService = {
  list(labels?: string) {
    return apiClient.GET('/api/v1/deployments', {
      params: {
        query: { labels },
      },
    })
  },

  get(name: string) {
    return apiClient.GET('/api/v1/deployments/{name}', {
      params: { path: { name } },
    })
  },

  put(
    name: string,
    body: DeploymentPutRequest,
    options?: { ifMatch?: number }
  ) {
    return apiClient.PUT('/api/v1/deployments/{name}', {
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
    return apiClient.DELETE('/api/v1/deployments/{name}', {
      params: {
        path: { name },
        header: { 'If-Match': options?.ifMatch },
      },
    })
  },
}
