import { createFileRoute } from '@tanstack/react-router'
import { PolicyEngines } from '@/features/policy-engines'

export const Route = createFileRoute('/_authenticated/policy-engines/')({
  component: PolicyEngines,
})
