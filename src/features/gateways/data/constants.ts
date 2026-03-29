export const gatewayStatusStyles = new Map<string, string>([
  ['ready', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [
    'provisioning',
    'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-300',
  ],
  [
    'error',
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-300',
  ],
  ['unknown', 'bg-neutral-300/40 border-neutral-300'],
])

export const gatewayStatuses = [
  { label: 'Ready', value: 'ready' },
  { label: 'Provisioning', value: 'provisioning' },
  { label: 'Error', value: 'error' },
  { label: 'Unknown', value: 'unknown' },
] as const
