import { createFileRoute } from '@tanstack/react-router'
import { GatewayDetail } from '@/features/gateways/detail'

export const Route = createFileRoute('/_authenticated/gateways/$gatewayId')({
  component: GatewayDetail,
})
