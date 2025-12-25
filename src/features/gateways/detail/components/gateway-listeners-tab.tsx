import { mockListeners, mockEnvironments } from '@/data/mock/flowc-data'
import { Plus, Shield, Globe } from 'lucide-react'
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
  gatewayId: string
}

export function GatewayListenersTab({ gatewayId }: GatewayListenersTabProps) {
  const listeners = mockListeners.filter((l) => l.gatewayId === gatewayId)

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
                <TableHead>Port</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>TLS Enabled</TableHead>
                <TableHead>Environments</TableHead>
                <TableHead>APIs</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listeners.map((listener) => (
                <TableRow key={`${listener.gatewayId}-${listener.port}`}>
                  <TableCell className='font-mono font-bold'>
                    :{listener.port}
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{listener.protocol}</Badge>
                  </TableCell>
                  <TableCell>
                    {listener.tlsEnabled ? (
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
                    <div className='flex items-center gap-1'>
                      <Globe className='h-4 w-4 text-muted-foreground' />
                      <span>{listener.environmentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>{listener.apiCount} APIs</TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {new Date(listener.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button variant='ghost' size='sm'>
                        View
                      </Button>
                      <Button variant='ghost' size='sm'>
                        Edit
                      </Button>
                      <Button variant='ghost' size='sm'>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Environments Breakdown */}
        {listeners.length > 0 && (
          <div className='mt-6'>
            <h3 className='mb-3 text-sm font-medium'>
              Environments by Listener
            </h3>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {listeners.map((listener) => {
                const envs = mockEnvironments.filter(
                  (e) => e.gatewayId === gatewayId && e.port === listener.port
                )

                return (
                  <Card key={`${listener.gatewayId}-${listener.port}-envs`}>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-sm'>
                        Port :{listener.port}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {envs.length === 0 ? (
                        <p className='text-xs text-muted-foreground'>
                          No environments
                        </p>
                      ) : (
                        <div className='space-y-1'>
                          {envs.map((env) => (
                            <div
                              key={env.name}
                              className='flex items-center justify-between text-sm'
                            >
                              <span>{env.name}</span>
                              <Badge variant='secondary' className='text-xs'>
                                {env.apiCount} APIs
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
