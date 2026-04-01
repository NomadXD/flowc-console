import { createFileRoute } from '@tanstack/react-router'
import { Observability } from '@/features/observability'

export const Route = createFileRoute('/_authenticated/observability/')({
  component: Observability,
})
