import { createFileRoute } from '@tanstack/react-router'
import { mockEnvironmentAPI } from '@/data/mock/flowc-data'
import { EnvironmentDetail } from '@/features/environments/detail'

export const Route = createFileRoute(
  '/_authenticated/environments/$gatewayId/$port/$envName'
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const environment = await mockEnvironmentAPI.get(
      params.gatewayId,
      Number(params.port),
      params.envName
    )
    if (!environment) {
      throw new Error('Environment not found')
    }
    return { environment }
  },
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { environment } = Route.useLoaderData()
  return <EnvironmentDetail environment={environment} />
}
