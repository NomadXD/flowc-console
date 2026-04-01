import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { gatewayProfilesService } from '@/lib/api/services/gateway-profiles'
import { throwOnError } from '@/lib/api/throw-on-error'
import type { GatewayProfilePutRequest } from '@/lib/api/openapi/types'

export const gatewayProfilesKeys = {
  all: ['gateway-profiles'] as const,
  lists: () => [...gatewayProfilesKeys.all, 'list'] as const,
  list: (labels?: string) =>
    [...gatewayProfilesKeys.lists(), { labels }] as const,
  details: () => [...gatewayProfilesKeys.all, 'detail'] as const,
  detail: (name: string) => [...gatewayProfilesKeys.details(), name] as const,
}

export function useGatewayProfiles(labels?: string) {
  return useQuery({
    queryKey: gatewayProfilesKeys.list(labels),
    queryFn: () => gatewayProfilesService.list(labels).then(throwOnError),
  })
}

export function useGatewayProfile(name: string) {
  return useQuery({
    queryKey: gatewayProfilesKeys.detail(name),
    queryFn: () => gatewayProfilesService.get(name).then(throwOnError),
    enabled: !!name,
  })
}

export function usePutGatewayProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      body,
      ifMatch,
    }: {
      name: string
      body: GatewayProfilePutRequest
      ifMatch?: number
    }) => {
      return gatewayProfilesService
        .put(name, body, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: gatewayProfilesKeys.lists(),
      })
      if (data?.metadata?.name) {
        queryClient.invalidateQueries({
          queryKey: gatewayProfilesKeys.detail(data.metadata.name),
        })
      }
      toast.success(
        `Gateway profile "${data?.metadata?.name}" saved successfully!`
      )
    },
    onError: (error: Error) => {
      toast.error(`Failed to save gateway profile: ${error.message}`)
    },
  })
}

export function useDeleteGatewayProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      ifMatch,
    }: {
      name: string
      ifMatch?: number
    }) => {
      return gatewayProfilesService
        .delete(name, { ifMatch })
        .then(throwOnError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gatewayProfilesKeys.lists(),
      })
      toast.success('Gateway profile deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete gateway profile: ${error.message}`)
    },
  })
}
