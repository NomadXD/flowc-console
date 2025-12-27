import { type Deployment } from '@/data/mock/flowc-data'

export const deploymentStatusStyles = new Map<Deployment['status'], string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [
    'inactive',
    'bg-neutral-300/40 text-neutral-600 dark:text-neutral-400 border-neutral-300',
  ],
  ['error', 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200'],
  [
    'deploying',
    'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  ],
])

export const deploymentStatuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Error', value: 'error' },
  { label: 'Deploying', value: 'deploying' },
] as const
