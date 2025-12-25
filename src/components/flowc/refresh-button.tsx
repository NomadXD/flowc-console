import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface RefreshButtonProps {
  onRefresh: () => void
  isLoading?: boolean
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  showLabel?: boolean
}

export function RefreshButton({
  onRefresh,
  isLoading = false,
  className,
  size = 'sm',
  variant = 'outline',
  showLabel = false,
}: RefreshButtonProps) {
  return (
    <Button
      onClick={onRefresh}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={cn(className)}
    >
      <RefreshCw
        className={cn(
          'h-4 w-4',
          isLoading && 'animate-spin',
          showLabel && 'mr-2'
        )}
      />
      {showLabel && 'Refresh'}
    </Button>
  )
}
