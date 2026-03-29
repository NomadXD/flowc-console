import { formatDistanceToNow } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import type { GatewayResponse } from '@/lib/api/openapi/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { gatewayStatusStyles } from '../data/constants'
import { DataTableRowActions } from './data-table-row-actions'

export const gatewaysColumns: ColumnDef<GatewayResponse>[] = [
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
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          variant='ghost'
          size='sm'
          className='h-6 w-6 p-0'
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>
      ) : null
    },
    meta: {
      className: 'w-8',
    },
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
      <Link
        to='/gateways/$gatewayId'
        params={{ gatewayId: row.original.metadata.name }}
        className='hover:underline'
      >
        <LongText className='max-w-36 ps-3 font-medium'>
          {row.original.metadata.name}
        </LongText>
      </Link>
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
    id: 'nodeId',
    accessorFn: (row) => row.spec.nodeId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Node ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32 text-muted-foreground'>
        {row.original.spec.nodeId}
      </LongText>
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
      const badgeColor = gatewayStatusStyles.get(phase) || gatewayStatusStyles.get('unknown')
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {phase}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.status?.phase || 'unknown')
    },
    enableHiding: false,
    enableSorting: false,
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
    cell: DataTableRowActions,
  },
]
