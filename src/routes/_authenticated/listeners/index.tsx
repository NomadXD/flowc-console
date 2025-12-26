import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { mockGateways } from '@/data/mock/flowc-data'
import { Listeners } from '@/features/listeners'

const listenersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  protocol: z
    .array(z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('TCP')]))
    .optional()
    .catch([]),
  gateway: z
    .array(
      z.enum(
        mockGateways.map((g) => g.id as (typeof mockGateways)[number]['id'])
      )
    )
    .optional()
    .catch([]),
  tls: z
    .array(z.union([z.literal('true'), z.literal('false')]))
    .optional()
    .catch([]),
  // Per-column text filter for port
  port: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/listeners/')({
  validateSearch: listenersSearchSchema,
  component: Listeners,
})
