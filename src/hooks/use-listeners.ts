import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  listenersService,
  type ListenerListParams,
} from '@/lib/api/services/listeners'
import { throwOnError } from '@/lib/api/throw-on-error'
import type { ListenerPutRequest } from '@/lib/api/openapi/types'

export const listenersKeys = {
  all: ['listeners'] as const,
  lists: () => [...listenersKeys.all, 'list'] as const,
  list: (params?: ListenerListParams) =>
    [...listenersKeys.lists(), params] as const,
  details: () => [...listenersKeys.all, 'detail'] as const,
  detail: (name: string) => [...listenersKeys.details(), name] as const,
}

export function useListeners(params?: ListenerListParams) {
  return useQuery({
    queryKey: listenersKeys.list(params),
    queryFn: () => listenersService.list(params).then(throwOnError),
  })
}

export function useListener(name: string) {
  return useQuery({
    queryKey: listenersKeys.detail(name),
    queryFn: () => listenersService.get(name).then(throwOnError),
    enabled: !!name,
  })
}

export function usePutListener() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      body,
      ifMatch,
    }: {
      name: string
      body: ListenerPutRequest
      ifMatch?: number
    }) => {
      return listenersService
        .put(name, body, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: listenersKeys.lists() })
      if (data?.metadata?.name) {
        queryClient.invalidateQueries({
          queryKey: listenersKeys.detail(data.metadata.name),
        })
      }
      toast.success(
        `Listener "${data?.metadata?.name}" saved successfully!`
      )
    },
    onError: (error: Error) => {
      toast.error(`Failed to save listener: ${error.message}`)
    },
  })
}

export function useDeleteListener() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      ifMatch,
    }: {
      name: string
      ifMatch?: number
    }) => {
      return listenersService
        .delete(name, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listenersKeys.lists() })
      toast.success('Listener deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete listener: ${error.message}`)
    },
  })
}
