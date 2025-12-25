import { createFileRoute } from '@tanstack/react-router'
import { mockGatewayAPI } from '@/data/mock/flowc-data'
import { GatewayDetail } from '@/features/gateways/detail'

export const Route = createFileRoute('/_authenticated/gateways/$gatewayId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const gateway = await mockGatewayAPI.get(params.gatewayId)
    if (!gateway) {
      throw new Error('Gateway not found')
    }
    return { gateway }
  },
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { gateway } = Route.useLoaderData()
  return <GatewayDetail gateway={gateway} />
}
