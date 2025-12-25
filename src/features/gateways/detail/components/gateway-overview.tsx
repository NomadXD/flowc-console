import { formatDistanceToNow } from 'date-fns'
import { mockDeployments, type Gateway } from '@/data/mock/flowc-data'
import { Server, Radio, Rocket, Clock, MapPin, Network } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/flowc'

interface GatewayOverviewProps {
  gateway: Gateway
}

export function GatewayOverview({ gateway }: GatewayOverviewProps) {
  // Get recent deployments for this gateway (last 5)
  const recentDeployments = mockDeployments
    .filter((d) => d.gatewayId === gateway.id)
    .sort(
      (a, b) =>
        new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
    )
    .slice(0, 5)

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
              <StatusBadge status={gateway.status} />
              <span className='text-2xl font-bold capitalize'>
                {gateway.status}
              </span>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Version {gateway.version}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Listeners</CardTitle>
            <Radio className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{gateway.listenerCount}</div>
            <p className='text-xs text-muted-foreground'>Active listeners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Deployed APIs</CardTitle>
            <Rocket className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{gateway.apiCount}</div>
            <p className='text-xs text-muted-foreground'>
              Across all environments
            </p>
          </CardContent>
        </Card>
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
                  <p className='text-sm text-muted-foreground'>
                    {gateway.nodeId}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Region</p>
                  <p className='text-sm text-muted-foreground'>
                    {gateway.region}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Network className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>IP Address</p>
                  <p className='font-mono text-sm text-muted-foreground'>
                    {gateway.ipAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-start gap-2'>
                <Clock className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Created</p>
                  <p className='text-sm text-muted-foreground'>
                    {formatDistanceToNow(new Date(gateway.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Clock className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Last Updated</p>
                  <p className='text-sm text-muted-foreground'>
                    {formatDistanceToNow(new Date(gateway.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Server className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Envoy Version</p>
                  <p className='text-sm text-muted-foreground'>
                    {gateway.version}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDeployments.length === 0 ? (
            <p className='py-4 text-center text-sm text-muted-foreground'>
              No deployments yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>API Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deployed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeployments.map((deployment) => (
                  <TableRow key={deployment.id}>
                    <TableCell className='font-medium'>
                      {deployment.apiName}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{deployment.version}</Badge>
                    </TableCell>
                    <TableCell>{deployment.environment}</TableCell>
                    <TableCell>
                      <StatusBadge status={deployment.status} />
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {formatDistanceToNow(new Date(deployment.deployedAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
