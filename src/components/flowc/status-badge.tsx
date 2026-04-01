import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export type StatusVariant =
  | 'online'
  | 'offline'
  | 'degraded'
  | 'active'
  | 'inactive'
  | 'error'
  | 'deploying'
  | 'success'
  | 'ready'
  | 'provisioning'
  | 'pending'
  | 'unknown'

interface StatusBadgeProps {
  status: StatusVariant
  className?: string
  showDot?: boolean
}

const statusConfig: Record<
  StatusVariant,
  { label: string; className: string; dotColor: string }
> = {
  online: {
    label: 'Online',
    className:
      'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400',
    dotColor: 'bg-green-500',
  },
  offline: {
    label: 'Offline',
    className:
      'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 dark:text-gray-400',
    dotColor: 'bg-gray-500',
  },
  degraded: {
    label: 'Degraded',
    className:
      'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400',
    dotColor: 'bg-yellow-500',
  },
  active: {
    label: 'Active',
    className:
      'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  inactive: {
    label: 'Inactive',
    className:
      'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 dark:text-gray-400',
    dotColor: 'bg-gray-500',
  },
  error: {
    label: 'Error',
    className:
      'bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400',
    dotColor: 'bg-red-500',
  },
  deploying: {
    label: 'Deploying',
    className:
      'bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 dark:text-purple-400',
    dotColor: 'bg-purple-500',
  },
  success: {
    label: 'Success',
    className:
      'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400',
    dotColor: 'bg-green-500',
  },
  ready: {
    label: 'Ready',
    className:
      'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400',
    dotColor: 'bg-green-500',
  },
  provisioning: {
    label: 'Provisioning',
    className:
      'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-400',
    dotColor: 'bg-blue-500',
  },
  pending: {
    label: 'Pending',
    className:
      'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400',
    dotColor: 'bg-yellow-500',
  },
  unknown: {
    label: 'Unknown',
    className:
      'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 dark:text-gray-400',
    dotColor: 'bg-gray-500',
  },
}

export function StatusBadge({
  status,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unknown

  return (
    <Badge
      variant='outline'
      className={cn(config.className, 'font-medium', className)}
    >
      {showDot && (
        <span
          className={cn(
            'mr-1.5 inline-block h-2 w-2 rounded-full',
            config.dotColor
          )}
          aria-hidden='true'
        />
      )}
      {config.label}
    </Badge>
  )
}
