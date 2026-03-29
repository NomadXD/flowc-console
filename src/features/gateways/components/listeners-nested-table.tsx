import type { ListenerResponse } from '@/lib/api/openapi/types'
import { Shield, ShieldOff, Loader2 } from 'lucide-react'
import { useListeners } from '@/hooks/use-listeners'
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
  gatewayName: string
}

export function ListenersNestedTable({
  gatewayName,
}: ListenersNestedTableProps) {
  const { data, isLoading } = useListeners()

  const listeners = (data?.items || []).filter(
    (l: ListenerResponse) => l.spec.gatewayRef === gatewayName
  )

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
      </div>
    )
  }

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
            <TableHead>Name</TableHead>
            <TableHead className='w-24'>Port</TableHead>
            <TableHead>TLS</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listeners.map((listener: ListenerResponse) => (
            <TableRow key={listener.metadata.name}>
              <TableCell className='font-medium'>
                {listener.metadata.name}
              </TableCell>
              <TableCell className='font-mono font-medium'>
                {listener.spec.port}
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-x-2'>
                  {listener.spec.tls ? (
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
              <TableCell className='text-sm text-muted-foreground'>
                {listener.spec.address || '0.0.0.0'}
              </TableCell>
              <TableCell>
                <Badge variant='outline' className='capitalize'>
                  {listener.status?.phase || 'unknown'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
