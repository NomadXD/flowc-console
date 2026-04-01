import { apiClient } from '../client'
import type { DeploymentPutRequest } from '../openapi/types'

export type DeploymentListParams = {
  labels?: string
  gatewayRef?: string
  listenerRef?: string
  virtualHostRef?: string
  apiRef?: string
}

export const deploymentsService = {
  list(params?: DeploymentListParams) {
    return apiClient.GET('/api/v1/deployments', {
      params: {
        query: params,
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
