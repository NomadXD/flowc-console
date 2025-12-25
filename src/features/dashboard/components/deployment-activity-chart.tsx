import { format } from 'date-fns'
import { mockDeploymentStats } from '@/data/mock/flowc-data'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function DeploymentActivityChart() {
  const data = mockDeploymentStats.recentActivity

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Activity</CardTitle>
        <CardDescription>API deployments over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='timestamp'
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className='rounded-lg border bg-background p-2 shadow-sm'>
                    <div className='grid gap-2'>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] text-muted-foreground uppercase'>
                          {format(
                            new Date(payload[0].payload.timestamp),
                            'MMM dd, yyyy'
                          )}
                        </span>
                        <span className='font-bold text-muted-foreground'>
                          {payload[0].value} deployments
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Area
              type='monotone'
              dataKey='count'
              stroke='currentColor'
              className='text-primary'
              fill='currentColor'
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
