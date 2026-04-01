import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, Search, Filter } from 'lucide-react'
import type { DeploymentResponse } from '@/lib/api/openapi/types'
import { useDeployments } from '@/hooks/use-deployments'
import { Badge } from '@/components/ui/badge'
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
import { StatusBadge, type StatusVariant } from '@/components/flowc'

interface GatewayApisTabProps {
  gatewayName: string
}

export function GatewayApisTab({ gatewayName }: GatewayApisTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: deploymentsData, isLoading } = useDeployments({
    gatewayRef: gatewayName,
  })

  const allDeployments = deploymentsData?.items || []

  // Apply filters
  const filteredDeployments = allDeployments.filter(
    (deployment: DeploymentResponse) => {
      const matchesSearch =
        searchQuery === '' ||
        deployment.metadata.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' ||
        deployment.status?.phase === statusFilter

      return matchesSearch && matchesStatus
    }
  )

  // Group by status
  const phases = allDeployments.map(
    (d: DeploymentResponse) => d.status?.phase || 'unknown'
  )
  const uniqueStatuses = Array.from(new Set(phases))

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>
              Total Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{allDeployments.length}</div>
          </CardContent>
        </Card>
        {uniqueStatuses.map((status) => (
          <Card key={status}>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium capitalize'>
                {status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {phases.filter((p: string) => p === status).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search deployments...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-8'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
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
                {searchQuery || statusFilter !== 'all'
                  ? 'No deployments match your filters'
                  : 'No deployments on this gateway'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API</TableHead>
                  <TableHead>Virtual Host</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeployments.map(
                  (deployment: DeploymentResponse) => (
                    <TableRow key={deployment.metadata.name}>
                      <TableCell className='font-medium'>
                        {deployment.metadata.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {deployment.spec.apiRef}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {deployment.spec.gateway?.virtualHost || '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            (deployment.status?.phase ||
                              'deploying') as StatusVariant
                          }
                        />
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        {deployment.metadata.createdAt
                          ? formatDistanceToNow(
                              new Date(deployment.metadata.createdAt),
                              { addSuffix: true }
                            )
                          : '-'}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
