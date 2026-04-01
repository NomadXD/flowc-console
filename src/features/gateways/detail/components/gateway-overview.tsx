import { formatDistanceToNow } from 'date-fns'
import { Server, Radio, Clock, Tag } from 'lucide-react'
import type { GatewayResponse } from '@/lib/api/openapi/types'
import { useListeners } from '@/hooks/use-listeners'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge, type StatusVariant } from '@/components/flowc'

interface GatewayOverviewProps {
  gateway: GatewayResponse
}

export function GatewayOverview({ gateway }: GatewayOverviewProps) {
  const { data: listenersData } = useListeners({
    gatewayRef: gateway.metadata.name,
  })
  const listeners = listenersData?.items || []

  const phase = gateway.status?.phase || 'unknown'

  return (
    <div className='grid gap-4'>
      {/* Metadata Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Status</CardTitle>
            <Server className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <StatusBadge status={phase as StatusVariant} />
              <span className='text-2xl font-bold capitalize'>{phase}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Listeners</CardTitle>
            <Radio className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{listeners.length}</div>
            <p className='text-xs text-muted-foreground'>Active listeners</p>
          </CardContent>
        </Card>

        {gateway.spec.profileRef && (
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Profile</CardTitle>
              <Tag className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {gateway.spec.profileRef}
              </div>
              <p className='text-xs text-muted-foreground'>Gateway profile</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gateway Details */}
      <Card>
        <CardHeader>
          <CardTitle>Gateway Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-3'>
              <div className='flex items-start gap-2'>
                <Server className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Node ID</p>
                  <p className='font-mono text-sm text-muted-foreground'>
                    {gateway.spec.nodeId}
                  </p>
                </div>
              </div>
              {gateway.spec.profileRef && (
                <div className='flex items-start gap-2'>
                  <Tag className='mt-0.5 h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Profile</p>
                    <p className='text-sm text-muted-foreground'>
                      {gateway.spec.profileRef}
                    </p>
                  </div>
                </div>
              )}
              <div className='flex items-start gap-2'>
                <Server className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Revision</p>
                  <p className='text-sm text-muted-foreground'>
                    {gateway.metadata.revision}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              {gateway.metadata.createdAt && (
                <div className='flex items-start gap-2'>
                  <Clock className='mt-0.5 h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Created</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDistanceToNow(
                        new Date(gateway.metadata.createdAt),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                </div>
              )}
              {gateway.metadata.updatedAt && (
                <div className='flex items-start gap-2'>
                  <Clock className='mt-0.5 h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Last Updated</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDistanceToNow(
                        new Date(gateway.metadata.updatedAt),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Labels */}
          {gateway.metadata.labels &&
            Object.keys(gateway.metadata.labels).length > 0 && (
              <div className='mt-4'>
                <p className='mb-2 text-sm font-medium'>Labels</p>
                <div className='flex flex-wrap gap-2'>
                  {Object.entries(gateway.metadata.labels).map(
                    ([key, value]) => (
                      <Badge key={key} variant='secondary'>
                        {key}: {value}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Conditions */}
      {gateway.status?.conditions && gateway.status.conditions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {gateway.status.conditions.map((condition, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div>
                    <p className='text-sm font-medium'>{condition.type}</p>
                    {condition.message && (
                      <p className='text-xs text-muted-foreground'>
                        {condition.message}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={condition.status as StatusVariant} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
