import { createFileRoute } from '@tanstack/react-router'
import { Secrets } from '@/features/secrets'

export const Route = createFileRoute('/_authenticated/secrets/')({
  component: Secrets,
})
