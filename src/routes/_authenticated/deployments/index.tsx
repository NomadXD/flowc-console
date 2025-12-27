import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { mockGateways, mockEnvironments } from '@/data/mock/flowc-data'
import { Deployments } from '@/features/deployments/deployments'

const deploymentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('error'),
        z.literal('deploying'),
      ])
    )
    .optional()
    .catch([]),
  gateway: z
    .array(
      z.enum(
        mockGateways.map((g) => g.name as (typeof mockGateways)[number]['name'])
      )
    )
    .optional()
    .catch([]),
  environment: z
    .array(
      z.enum(
        Array.from(new Set(mockEnvironments.map((e) => e.name))) as [
          string,
          ...string[],
        ]
      )
    )
    .optional()
    .catch([]),
  // Per-column text filter for API name
  api: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/deployments/')({
  validateSearch: deploymentsSearchSchema,
  component: Deployments,
})
