import { type ColumnDef } from '@tanstack/react-table'
import type { ListenerResponse } from '@/lib/api/openapi/types'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const listenersColumns: ColumnDef<ListenerResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'name',
    accessorFn: (row) => row.metadata.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 ps-3 font-medium'>
        {row.original.metadata.name}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'port',
    accessorFn: (row) => row.spec.port,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Port' />
    ),
    cell: ({ row }) => (
      <div className='font-mono font-semibold'>{row.original.spec.port}</div>
    ),
  },
  {
    id: 'gatewayRef',
    accessorFn: (row) => row.spec.gatewayRef,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gateway' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 font-medium text-primary'>
        {row.original.spec.gatewayRef}
      </LongText>
    ),
    filterFn: (row, _id, value) => {
      return value.includes(row.original.spec.gatewayRef)
    },
  },
  {
    id: 'tls',
    accessorFn: (row) => !!row.spec.tls,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TLS' />
    ),
    cell: ({ row }) => {
      const hasTls = !!row.original.spec.tls
      return (
        <div className='flex items-center gap-2'>
          {hasTls ? (
            <>
              <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-500' />
              <span className='text-sm'>Enabled</span>
            </>
          ) : (
            <>
              <XCircle className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>Disabled</span>
            </>
          )}
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      const hasTls = !!row.original.spec.tls
      return value.includes(hasTls.toString())
    },
  },
  {
    id: 'address',
    accessorFn: (row) => row.spec.address,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm text-muted-foreground'>
        {row.original.spec.address || '0.0.0.0'}
      </span>
    ),
  },
  {
    id: 'status',
    accessorFn: (row) => row.status?.phase,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const phase = row.original.status?.phase || 'unknown'
      return (
        <Badge variant='outline' className='capitalize'>
          {phase}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 rounded-tr-[inherit]'),
    },
  },
]
