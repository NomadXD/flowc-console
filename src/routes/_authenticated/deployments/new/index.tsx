import { createFileRoute } from '@tanstack/react-router'
import { ApiWizard } from '@/features/api-wizard'

export const Route = createFileRoute('/_authenticated/deployments/new/')({
  component: ApiWizard,
})
