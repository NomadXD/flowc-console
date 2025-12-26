import { formatDistanceToNow } from 'date-fns'
import { mockDeployments, type Environment } from '@/data/mock/flowc-data'
import { Rocket, Download, Trash2, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge, EmptyState } from '@/components/flowc'

interface EnvironmentApisTabProps {
  environment: Environment
}

export function EnvironmentApisTab({ environment }: EnvironmentApisTabProps) {
  // Get all deployments for this environment
  const deployments = mockDeployments.filter(
    (d) =>
      d.environment === environment.name &&
      d.gatewayId === environment.gatewayId &&
      d.port === environment.port
  )

  if (deployments.length === 0) {
    return (
      <EmptyState
        icon={Rocket}
        title='No APIs deployed'
        description='Deploy your first API to this environment to get started.'
      />
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Deployed APIs ({deployments.length})</CardTitle>
        <Button disabled>
          <Rocket className='mr-2 h-4 w-4' />
          Deploy New API
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Spec File</TableHead>
              <TableHead>Deployed By</TableHead>
              <TableHead>Deployed</TableHead>
              <TableHead className='w-[50px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deployments.map((deployment) => (
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
                <TableCell>
                  <code className='text-xs text-muted-foreground'>
                    {deployment.specFile}
                  </code>
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {deployment.deployedBy}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {formatDistanceToNow(new Date(deployment.deployedAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Download className='mr-2 h-4 w-4' />
                        Download Spec
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='text-destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
