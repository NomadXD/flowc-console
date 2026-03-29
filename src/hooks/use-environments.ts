import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { environmentsService } from '@/lib/api/services/environments'
import { throwOnError } from '@/lib/api/throw-on-error'
import type { EnvironmentPutRequest } from '@/lib/api/openapi/types'

export const environmentsKeys = {
  all: ['environments'] as const,
  lists: () => [...environmentsKeys.all, 'list'] as const,
  list: (labels?: string) =>
    [...environmentsKeys.lists(), { labels }] as const,
  details: () => [...environmentsKeys.all, 'detail'] as const,
  detail: (name: string) =>
    [...environmentsKeys.details(), name] as const,
}

export function useEnvironments(labels?: string) {
  return useQuery({
    queryKey: environmentsKeys.list(labels),
    queryFn: () =>
      environmentsService.list(labels).then(throwOnError),
  })
}

export function useEnvironment(name: string) {
  return useQuery({
    queryKey: environmentsKeys.detail(name),
    queryFn: () => environmentsService.get(name).then(throwOnError),
    enabled: !!name,
  })
}

export function usePutEnvironment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      body,
      ifMatch,
    }: {
      name: string
      body: EnvironmentPutRequest
      ifMatch?: number
    }) => {
      return environmentsService
        .put(name, body, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: environmentsKeys.lists(),
      })
      if (data?.metadata?.name) {
        queryClient.invalidateQueries({
          queryKey: environmentsKeys.detail(data.metadata.name),
        })
      }
      toast.success(
        `Environment "${data?.metadata?.name}" saved successfully!`
      )
    },
    onError: (error: Error) => {
      toast.error(`Failed to save environment: ${error.message}`)
    },
  })
}

export function useDeleteEnvironment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      ifMatch,
    }: {
      name: string
      ifMatch?: number
    }) => {
      return environmentsService
        .delete(name, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: environmentsKeys.lists(),
      })
      toast.success('Environment deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete environment: ${error.message}`)
    },
  })
}
