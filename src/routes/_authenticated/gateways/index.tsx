import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Gateways } from '@/features/gateways'

const gatewaysSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(z.string())
    .optional()
    .catch([]),
  // Per-column text filter for gateway name
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/gateways/')({
  validateSearch: gatewaysSearchSchema,
  component: Gateways,
})
