import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  virtualHostsService,
  type VirtualHostListParams,
} from '@/lib/api/services/virtual-hosts'
import { throwOnError } from '@/lib/api/throw-on-error'
import type { VirtualHostPutRequest } from '@/lib/api/openapi/types'

export const virtualHostsKeys = {
  all: ['virtual-hosts'] as const,
  lists: () => [...virtualHostsKeys.all, 'list'] as const,
  list: (params?: VirtualHostListParams) =>
    [...virtualHostsKeys.lists(), params] as const,
  details: () => [...virtualHostsKeys.all, 'detail'] as const,
  detail: (name: string) => [...virtualHostsKeys.details(), name] as const,
}

export function useVirtualHosts(params?: VirtualHostListParams) {
  return useQuery({
    queryKey: virtualHostsKeys.list(params),
    queryFn: () => virtualHostsService.list(params).then(throwOnError),
  })
}

export function useVirtualHost(name: string) {
  return useQuery({
    queryKey: virtualHostsKeys.detail(name),
    queryFn: () => virtualHostsService.get(name).then(throwOnError),
    enabled: !!name,
  })
}

export function usePutVirtualHost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      body,
      ifMatch,
    }: {
      name: string
      body: VirtualHostPutRequest
      ifMatch?: number
    }) => {
      return virtualHostsService
        .put(name, body, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: virtualHostsKeys.lists(),
      })
      if (data?.metadata?.name) {
        queryClient.invalidateQueries({
          queryKey: virtualHostsKeys.detail(data.metadata.name),
        })
      }
      toast.success(
        `Virtual host "${data?.metadata?.name}" saved successfully!`
      )
    },
    onError: (error: Error) => {
      toast.error(`Failed to save virtual host: ${error.message}`)
    },
  })
}

export function useDeleteVirtualHost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      ifMatch,
    }: {
      name: string
      ifMatch?: number
    }) => {
      return virtualHostsService
        .delete(name, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: virtualHostsKeys.lists(),
      })
      toast.success('Virtual host deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete virtual host: ${error.message}`)
    },
  })
}
