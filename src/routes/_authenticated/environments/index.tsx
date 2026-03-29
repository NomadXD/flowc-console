import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Environments } from '@/features/environments'

const environmentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  gateway: z.array(z.string()).optional().catch([]),
  listener: z.array(z.string()).optional().catch([]),
  // Per-column text filters
  name: z.string().optional().catch(''),
  hostname: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/environments/')({
  validateSearch: environmentsSearchSchema,
  component: Environments,
})
