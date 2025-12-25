import { type Listener, mockListeners } from '@/data/mock/flowc-data'
import { Shield, ShieldOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ListenersNestedTableProps {
  gatewayId: string
}

export function ListenersNestedTable({ gatewayId }: ListenersNestedTableProps) {
  const listeners = mockListeners.filter((l) => l.gatewayId === gatewayId)

  if (listeners.length === 0) {
    return (
      <div className='py-8 text-center text-sm text-muted-foreground'>
        No listeners configured for this gateway
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-muted/30'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-24'>Port</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>TLS</TableHead>
            <TableHead className='text-center'>Environments</TableHead>
            <TableHead className='text-center'>APIs</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listeners.map((listener: Listener) => (
            <TableRow key={`${listener.gatewayId}-${listener.port}`}>
              <TableCell className='font-mono font-medium'>
                {listener.port}
              </TableCell>
              <TableCell>
                <Badge
                  variant='outline'
                  className={
                    listener.protocol === 'HTTPS'
                      ? 'border-green-300 bg-green-100/30 text-green-900 dark:text-green-200'
                      : 'border-blue-300 bg-blue-100/30 text-blue-900 dark:text-blue-200'
                  }
                >
                  {listener.protocol}
                </Badge>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-x-2'>
                  {listener.tlsEnabled ? (
                    <>
                      <Shield className='h-4 w-4 text-green-600' />
                      <span className='text-sm text-green-600'>Enabled</span>
                    </>
                  ) : (
                    <>
                      <ShieldOff className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm text-muted-foreground'>
                        Disabled
                      </span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className='text-center'>
                {listener.environmentCount}
              </TableCell>
              <TableCell className='text-center'>{listener.apiCount}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {new Date(listener.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
