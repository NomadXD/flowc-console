import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { apisService } from '@/lib/api/services/apis'
import { uploadService } from '@/lib/api/services/upload'
import { throwOnError } from '@/lib/api/throw-on-error'
import type { APIPutRequest } from '@/lib/api/openapi/types'

export const apisKeys = {
  all: ['apis'] as const,
  lists: () => [...apisKeys.all, 'list'] as const,
  list: (labels?: string) => [...apisKeys.lists(), { labels }] as const,
  details: () => [...apisKeys.all, 'detail'] as const,
  detail: (name: string) => [...apisKeys.details(), name] as const,
}

export function useApis(labels?: string) {
  return useQuery({
    queryKey: apisKeys.list(labels),
    queryFn: () => apisService.list(labels).then(throwOnError),
  })
}

export function useApi(name: string) {
  return useQuery({
    queryKey: apisKeys.detail(name),
    queryFn: () => apisService.get(name).then(throwOnError),
    enabled: !!name,
  })
}

export function usePutApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      body,
      ifMatch,
    }: {
      name: string
      body: APIPutRequest
      ifMatch?: number
    }) => {
      return apisService.put(name, body, { ifMatch }).then(throwOnError)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: apisKeys.lists() })
      if (data?.metadata?.name) {
        queryClient.invalidateQueries({
          queryKey: apisKeys.detail(data.metadata.name),
        })
      }
      toast.success(
        `API "${data?.spec?.displayName || data?.metadata?.name}" saved successfully!`
      )
    },
    onError: (error: Error) => {
      toast.error(`Failed to save API: ${error.message}`)
    },
  })
}

export function useDeleteApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      ifMatch,
    }: {
      name: string
      ifMatch?: number
    }) => {
      return apisService.delete(name, { ifMatch }).then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apisKeys.lists() })
      toast.success('API deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete API: ${error.message}`)
    },
  })
}

export function useUploadApiBundle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: Blob) => {
      return uploadService.uploadBundle(file).then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apisKeys.lists() })
      toast.success('API bundle uploaded successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload bundle: ${error.message}`)
    },
  })
}

export function usePrefetchApi() {
  const queryClient = useQueryClient()

  return (name: string) => {
    queryClient.prefetchQuery({
      queryKey: apisKeys.detail(name),
      queryFn: () => apisService.get(name).then(throwOnError),
    })
  }
}
