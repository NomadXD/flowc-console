import { formatDistanceToNow } from 'date-fns'
import { mockDeployments } from '@/data/mock/flowc-data'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/flowc'

export function RecentDeploymentsTable() {
  // Show last 10 deployments sorted by date
  const recentDeployments = [...mockDeployments]
    .sort(
      (a, b) =>
        new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
    )
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Deployments</CardTitle>
        <CardDescription>
          Latest API deployments across all gateways
        </CardDescription>
        <CardAction>
          <Button variant='ghost' size='sm' disabled>
            View All
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Deployed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentDeployments.map((deployment) => (
              <TableRow key={deployment.id}>
                <TableCell className='font-medium'>
                  {deployment.apiName}
                </TableCell>
                <TableCell className='font-mono text-xs'>
                  {deployment.version}
                </TableCell>
                <TableCell>{deployment.environment}</TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {deployment.gatewayName}
                </TableCell>
                <TableCell>
                  <StatusBadge status={deployment.status} />
                </TableCell>
                <TableCell className='text-right text-sm text-muted-foreground'>
                  {formatDistanceToNow(new Date(deployment.deployedAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
