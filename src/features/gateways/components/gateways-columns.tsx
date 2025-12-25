import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { type Gateway } from '@/data/mock/flowc-data'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { gatewayStatusStyles, regions } from '../data/constants'
import { DataTableRowActions } from './data-table-row-actions'

export const gatewaysColumns: ColumnDef<Gateway>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <Link
        to='/gateways/$gatewayId'
        params={{ gatewayId: row.original.id }}
        className='hover:underline'
      >
        <LongText className='max-w-36 ps-3 font-medium'>
          {row.getValue('name')}
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
    accessorKey: 'nodeId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Node ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32 text-muted-foreground'>
        {row.getValue('nodeId')}
      </LongText>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const badgeColor = gatewayStatusStyles.get(status)
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'region',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Region' />
    ),
    cell: ({ row }) => {
      const { region } = row.original
      const regionInfo = regions.find(({ value }) => value === region)

      if (!regionInfo) {
        return <span className='text-sm'>{region}</span>
      }

      return (
        <div className='flex items-center gap-x-2'>
          {regionInfo.icon && (
            <regionInfo.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm'>{regionInfo.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ipAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='IP Address' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('ipAddress')}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'listenerCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Listeners' />
    ),
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('listenerCount')}</div>
    ),
  },
  {
    accessorKey: 'apiCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='APIs' />
    ),
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('apiCount')}</div>
    ),
  },
  {
    accessorKey: 'version',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Version' />
    ),
    cell: ({ row }) => (
      <Badge variant='secondary' className='font-mono text-xs'>
        {row.getValue('version')}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
