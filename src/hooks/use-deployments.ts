import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  deploymentsService,
  type DeploymentListParams,
} from '@/lib/api/services/deployments'
import { throwOnError } from '@/lib/api/throw-on-error'
import type { DeploymentPutRequest } from '@/lib/api/openapi/types'

export const deploymentsKeys = {
  all: ['deployments'] as const,
  lists: () => [...deploymentsKeys.all, 'list'] as const,
  list: (params?: DeploymentListParams) =>
    [...deploymentsKeys.lists(), params] as const,
  details: () => [...deploymentsKeys.all, 'detail'] as const,
  detail: (name: string) =>
    [...deploymentsKeys.details(), name] as const,
}

export function useDeployments(params?: DeploymentListParams) {
  return useQuery({
    queryKey: deploymentsKeys.list(params),
    queryFn: () => deploymentsService.list(params).then(throwOnError),
  })
}

export function useDeployment(name: string) {
  return useQuery({
    queryKey: deploymentsKeys.detail(name),
    queryFn: () => deploymentsService.get(name).then(throwOnError),
    enabled: !!name,
  })
}

export function usePutDeployment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      body,
      ifMatch,
    }: {
      name: string
      body: DeploymentPutRequest
      ifMatch?: number
    }) => {
      return deploymentsService
        .put(name, body, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: deploymentsKeys.lists(),
      })
      if (data?.metadata?.name) {
        queryClient.invalidateQueries({
          queryKey: deploymentsKeys.detail(data.metadata.name),
        })
      }
      toast.success(
        `Deployment "${data?.metadata?.name}" saved successfully!`
      )
    },
    onError: (error: Error) => {
      toast.error(`Failed to save deployment: ${error.message}`)
    },
  })
}

export function useDeleteDeployment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      ifMatch,
    }: {
      name: string
      ifMatch?: number
    }) => {
      return deploymentsService
        .delete(name, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: deploymentsKeys.lists(),
      })
      toast.success('Deployment deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete deployment: ${error.message}`)
    },
  })
}
