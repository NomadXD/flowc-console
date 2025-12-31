import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { APIs } from '@/features/apis'

const apisSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('draft'),
        z.literal('ready'),
        z.literal('deployed'),
        z.literal('deprecated'),
      ])
    )
    .optional()
    .catch([]),
  // Per-column text filter for API name
  api: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/apis/')({
  validateSearch: apisSearchSchema,
  component: APIs,
})
