import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {Icon && <Icon className='h-4 w-4 text-muted-foreground' />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {(description || trend) && (
          <div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
            {trend && (
              <span
                className={cn(
                  'flex items-center gap-1 font-medium',
                  trend.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className='h-3 w-3' />
                ) : (
                  <TrendingDown className='h-3 w-3' />
                )}
                {trend.value}%
              </span>
            )}
            {trend?.label && <span>{trend.label}</span>}
            {description && !trend && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
