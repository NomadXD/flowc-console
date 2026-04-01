import { createFileRoute } from '@tanstack/react-router'
import { GatewayProfiles } from '@/features/gateway-profiles'

export const Route = createFileRoute(
  '/_authenticated/settings/gateway-profiles'
)({
  component: GatewayProfiles,
})
