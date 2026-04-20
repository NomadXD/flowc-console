import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { GatewayDetail } from '@/features/gateways/detail'

const gatewayDetailSearchSchema = z.object({
  tab: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/gateways/$gatewayId')({
  validateSearch: gatewayDetailSearchSchema,
  component: GatewayDetail,
})
