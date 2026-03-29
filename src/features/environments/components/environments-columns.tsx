import { formatDistanceToNow } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import type { EnvironmentResponse } from '@/lib/api/openapi/types'
import { Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { getEnvironmentStyle } from '../data/constants'
import { DataTableRowActions } from './data-table-row-actions'

export const environmentsColumns: ColumnDef<EnvironmentResponse>[] = [
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
      <DataTableColumnHeader column={column} title='Environment' />
    ),
    cell: ({ row }) => {
      const style = getEnvironmentStyle(row.original.metadata.name)
      return (
        <div className='flex items-center gap-2 ps-3'>
          <Badge variant={style.variant}>{style.label}</Badge>
        </div>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'hostname',
    accessorFn: (row) => row.spec.hostname,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hostname' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-60 font-mono text-sm'>
        {row.original.spec.hostname}
      </LongText>
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
    id: 'listenerRef',
    accessorFn: (row) => row.spec.listenerRef,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Listener' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 font-mono text-sm'>
        {row.original.spec.listenerRef}
      </LongText>
    ),
    filterFn: (row, _id, value) => {
      return value.includes(row.original.spec.listenerRef)
    },
  },
  {
    id: 'httpFilters',
    accessorFn: (row) => row.spec.httpFilters?.length ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='HTTP Filters' />
    ),
    cell: ({ row }) => {
      const filters = row.original.spec.httpFilters || []
      return (
        <div className='flex items-center gap-2'>
          {filters.length > 0 ? (
            <>
              <Filter className='h-4 w-4 text-blue-600 dark:text-blue-400' />
              <span className='text-sm tabular-nums'>{filters.length}</span>
            </>
          ) : (
            <span className='text-sm text-muted-foreground'>None</span>
          )}
        </div>
      )
    },
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
    id: 'updatedAt',
    accessorFn: (row) => row.metadata.updatedAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated' />
    ),
    cell: ({ row }) => {
      const updatedAt = new Date(row.original.metadata.updatedAt)
      return (
        <span className='text-xs text-muted-foreground'>
          {formatDistanceToNow(updatedAt, { addSuffix: true })}
        </span>
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
