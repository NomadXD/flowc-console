import { formatDistanceToNow } from 'date-fns'
import { mockDeployments, type Environment } from '@/data/mock/flowc-data'
import {
  Globe,
  Rocket,
  Shield,
  Clock,
  Server,
  Lock,
  Key,
  FileKey,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

interface EnvironmentOverviewProps {
  environment: Environment
}

export function EnvironmentOverview({ environment }: EnvironmentOverviewProps) {
  // Get recent deployments for this environment (last 5)
  const recentDeployments = mockDeployments
    .filter(
      (d) =>
        d.environment === environment.name &&
        d.gatewayId === environment.gatewayId &&
        d.port === environment.port
    )
    .sort(
      (a, b) =>
        new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
    )
    .slice(0, 5)

  // Note: Policies are shown in the Policies tab

  return (
    <div className='grid gap-4'>
      {/* Metadata Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Environment</CardTitle>
            <Globe className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{environment.name}</div>
            <p className='text-xs text-muted-foreground'>
              Gateway: {environment.gatewayName}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Deployed APIs</CardTitle>
            <Rocket className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{environment.apiCount}</div>
            <p className='text-xs text-muted-foreground'>Active deployments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Policies</CardTitle>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {environment.policies.length}
            </div>
            <p className='text-xs text-muted-foreground'>
              Applied mediation policies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Environment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-3'>
              <div className='flex items-start gap-2'>
                <Globe className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Hostname</p>
                  <p className='font-mono text-sm text-muted-foreground'>
                    {environment.hostname}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Server className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>SNI (Server Name)</p>
                  <p className='font-mono text-sm text-muted-foreground'>
                    {environment.sni}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Server className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Listener Port</p>
                  <p className='font-mono text-sm text-muted-foreground'>
                    {environment.port}
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
                    {formatDistanceToNow(new Date(environment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Shield className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Gateway</p>
                  <p className='text-sm text-muted-foreground'>
                    {environment.gatewayName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TLS Configuration */}
      {environment.tlsConfig ? (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Lock className='h-5 w-5' />
              TLS Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-start gap-2'>
                <Key className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Certificate Path</p>
                  <p className='font-mono text-sm text-muted-foreground'>
                    {environment.tlsConfig.certPath}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <FileKey className='mt-0.5 h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Private Key Path</p>
                  <p className='font-mono text-sm text-muted-foreground'>
                    {environment.tlsConfig.keyPath}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <Lock className='h-4 w-4' />
          <AlertDescription>
            No TLS configuration for this environment
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Deployments */}
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
                  <TableHead>Status</TableHead>
                  <TableHead>Deployed By</TableHead>
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
                    <TableCell>
                      <StatusBadge status={deployment.status} />
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {deployment.deployedBy}
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
