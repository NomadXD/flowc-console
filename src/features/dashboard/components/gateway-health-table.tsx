import { mockGateways } from '@/data/mock/flowc-data'
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

export function GatewayHealthTable() {
  // Show top 5 gateways
  const topGateways = mockGateways.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gateway Health Status</CardTitle>
        <CardDescription>
          Overview of your gateway infrastructure
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
              <TableHead>Gateway</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className='text-right'>Listeners</TableHead>
              <TableHead className='text-right'>APIs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topGateways.map((gateway) => (
              <TableRow key={gateway.id}>
                <TableCell className='font-medium'>{gateway.name}</TableCell>
                <TableCell>
                  <StatusBadge status={gateway.status} />
                </TableCell>
                <TableCell>{gateway.region}</TableCell>
                <TableCell className='text-right'>
                  {gateway.listenerCount}
                </TableCell>
                <TableCell className='text-right'>{gateway.apiCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
