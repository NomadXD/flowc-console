import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { mockDeployments } from '@/data/mock/flowc-data'
import { Search, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/flowc'

interface GatewayApisTabProps {
  gatewayId: string
}

export function GatewayApisTab({ gatewayId }: GatewayApisTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [environmentFilter, setEnvironmentFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Get all deployments for this gateway
  const allDeployments = mockDeployments.filter(
    (d) => d.gatewayId === gatewayId
  )

  // Get unique environments and statuses for filters
  const environments = Array.from(
    new Set(allDeployments.map((d) => d.environment))
  )
  const statuses = Array.from(new Set(allDeployments.map((d) => d.status)))

  // Apply filters
  const filteredDeployments = allDeployments.filter((deployment) => {
    const matchesSearch =
      searchQuery === '' ||
      deployment.apiName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEnvironment =
      environmentFilter === 'all' ||
      deployment.environment === environmentFilter
    const matchesStatus =
      statusFilter === 'all' || deployment.status === statusFilter

    return matchesSearch && matchesEnvironment && matchesStatus
  })

  // Group by status
  const activeCount = allDeployments.filter((d) => d.status === 'active').length
  const errorCount = allDeployments.filter((d) => d.status === 'error').length
  const deployingCount = allDeployments.filter(
    (d) => d.status === 'deploying'
  ).length

  return (
    <div className='space-y-4'>
      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Total APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{allDeployments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {activeCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{errorCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Deploying</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {deployingCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Deployed APIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search APIs...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-8'
              />
            </div>
            <Select
              value={environmentFilter}
              onValueChange={setEnvironmentFilter}
            >
              <SelectTrigger className='w-[180px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Environment' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Environments</SelectItem>
                {environments.map((env) => (
                  <SelectItem key={env} value={env}>
                    {env}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredDeployments.length === 0 ? (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground'>
                {searchQuery ||
                environmentFilter !== 'all' ||
                statusFilter !== 'all'
                  ? 'No APIs match your filters'
                  : 'No APIs deployed on this gateway'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>API Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deployed By</TableHead>
                  <TableHead>Deployed</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeployments.map((deployment) => (
                  <TableRow key={deployment.id}>
                    <TableCell className='font-medium'>
                      {deployment.apiName}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{deployment.version}</Badge>
                    </TableCell>
                    <TableCell className='font-mono'>
                      :{deployment.port}
                    </TableCell>
                    <TableCell>{deployment.environment}</TableCell>
                    <TableCell>
                      <StatusBadge status={deployment.status} />
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {deployment.deployedBy}
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {formatDistanceToNow(new Date(deployment.deployedAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' size='sm'>
                          View
                        </Button>
                        <Button variant='ghost' size='sm'>
                          Update
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600'
                        >
                          Delete
                        </Button>
                      </div>
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
