import { Loader2, Plus, Shield, Globe } from 'lucide-react'
import type { ListenerResponse } from '@/lib/api/openapi/types'
import { useListeners } from '@/hooks/use-listeners'
import { useVirtualHosts } from '@/hooks/use-virtual-hosts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface GatewayListenersTabProps {
  gatewayName: string
}

export function GatewayListenersTab({ gatewayName }: GatewayListenersTabProps) {
  const { data: listenersData, isLoading } = useListeners({
    gatewayRef: gatewayName,
  })
  const { data: virtualHostsData } = useVirtualHosts({
    gatewayRef: gatewayName,
  })

  const listeners = listenersData?.items || []
  const virtualHosts = virtualHostsData?.items || []

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Listeners</CardTitle>
        <Button size='sm'>
          <Plus className='mr-2 h-4 w-4' />
          Add Listener
        </Button>
      </CardHeader>
      <CardContent>
        {listeners.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='mb-4 text-muted-foreground'>
              No listeners configured for this gateway
            </p>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Add Your First Listener
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>TLS</TableHead>
                <TableHead>HTTP/2</TableHead>
                <TableHead>Virtual Hosts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listeners.map((listener: ListenerResponse) => {
                const listenerEnvs = virtualHosts.filter(
                  (e) => e.spec.listenerRef === listener.metadata.name
                )
                return (
                  <TableRow key={listener.metadata.name}>
                    <TableCell className='font-medium'>
                      {listener.metadata.name}
                    </TableCell>
                    <TableCell className='font-mono font-bold'>
                      :{listener.spec.port}
                    </TableCell>
                    <TableCell className='font-mono text-sm text-muted-foreground'>
                      {listener.spec.address || '0.0.0.0'}
                    </TableCell>
                    <TableCell>
                      {listener.spec.tls ? (
                        <div className='flex items-center gap-1 text-green-600'>
                          <Shield className='h-4 w-4' />
                          <span className='text-sm'>Enabled</span>
                        </div>
                      ) : (
                        <span className='text-sm text-muted-foreground'>
                          Disabled
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {listener.spec.http2 ? (
                        <Badge variant='outline'>HTTP/2</Badge>
                      ) : (
                        <span className='text-sm text-muted-foreground'>
                          HTTP/1.1
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Globe className='h-4 w-4 text-muted-foreground' />
                        <span>{listenerEnvs.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='secondary'
                        className='capitalize'
                      >
                        {listener.status?.phase || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' size='sm'>
                          Edit
                        </Button>
                        <Button variant='ghost' size='sm'>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        {/* Virtual Hosts Breakdown */}
        {listeners.length > 0 && virtualHosts.length > 0 && (
          <div className='mt-6'>
            <h3 className='mb-3 text-sm font-medium'>
              Virtual Hosts by Listener
            </h3>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {listeners.map((listener: ListenerResponse) => {
                const envs = virtualHosts.filter(
                  (e) => e.spec.listenerRef === listener.metadata.name
                )

                return (
                  <Card key={listener.metadata.name}>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-sm'>
                        {listener.metadata.name} (:{listener.spec.port})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {envs.length === 0 ? (
                        <p className='text-xs text-muted-foreground'>
                          No virtual hosts
                        </p>
                      ) : (
                        <div className='space-y-1'>
                          {envs.map((env) => (
                            <div
                              key={env.metadata.name}
                              className='flex items-center justify-between text-sm'
                            >
                              <span>{env.metadata.name}</span>
                              <Badge variant='secondary' className='text-xs'>
                                {env.spec.hostname}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
