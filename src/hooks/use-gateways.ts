import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { gatewaysService } from '@/lib/api/services/gateways'
import { throwOnError } from '@/lib/api/throw-on-error'
import type { GatewayPutRequest } from '@/lib/api/openapi/types'

export const gatewaysKeys = {
  all: ['gateways'] as const,
  lists: () => [...gatewaysKeys.all, 'list'] as const,
  list: (labels?: string) =>
    [...gatewaysKeys.lists(), { labels }] as const,
  details: () => [...gatewaysKeys.all, 'detail'] as const,
  detail: (name: string) => [...gatewaysKeys.details(), name] as const,
}

export function useGateways(labels?: string) {
  return useQuery({
    queryKey: gatewaysKeys.list(labels),
    queryFn: () =>
      gatewaysService.list(labels).then(throwOnError),
  })
}

export function useGateway(name: string) {
  return useQuery({
    queryKey: gatewaysKeys.detail(name),
    queryFn: () => gatewaysService.get(name).then(throwOnError),
    enabled: !!name,
  })
}

export function usePutGateway() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      body,
      ifMatch,
    }: {
      name: string
      body: GatewayPutRequest
      ifMatch?: number
    }) => {
      return gatewaysService
        .put(name, body, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gatewaysKeys.lists() })
      if (data?.metadata?.name) {
        queryClient.invalidateQueries({
          queryKey: gatewaysKeys.detail(data.metadata.name),
        })
      }
      toast.success(
        `Gateway "${data?.metadata?.name}" saved successfully!`
      )
    },
    onError: (error: Error) => {
      toast.error(`Failed to save gateway: ${error.message}`)
    },
  })
}

export function useDeleteGateway() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      ifMatch,
    }: {
      name: string
      ifMatch?: number
    }) => {
      return gatewaysService
        .delete(name, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gatewaysKeys.lists() })
      toast.success('Gateway deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete gateway: ${error.message}`)
    },
  })
}
