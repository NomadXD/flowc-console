import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Gateways } from '@/features/gateways'
import { regions } from '@/features/gateways/data/constants'

const gatewaysSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('online'),
        z.literal('offline'),
        z.literal('degraded'),
      ])
    )
    .optional()
    .catch([]),
  region: z
    .array(
      z.enum(regions.map((r) => r.value as (typeof regions)[number]['value']))
    )
    .optional()
    .catch([]),
  // Per-column text filter for gateway name
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/gateways/')({
  validateSearch: gatewaysSearchSchema,
  component: Gateways,
})
