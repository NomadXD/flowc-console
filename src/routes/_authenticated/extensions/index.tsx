import { createFileRoute } from '@tanstack/react-router'
import { Extensions } from '@/features/extensions'

export const Route = createFileRoute('/_authenticated/extensions/')({
  component: Extensions,
})
