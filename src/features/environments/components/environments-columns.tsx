import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { type Environment } from '@/data/mock/flowc-data'
import { CheckCircle2, XCircle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { getEnvironmentStyle, hasTLS } from '../data/constants'
import { DataTableRowActions } from './data-table-row-actions'

export const environmentsColumns: ColumnDef<Environment>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Environment' />
    ),
    cell: ({ row }) => {
      const style = getEnvironmentStyle(row.getValue('name'))
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
    accessorKey: 'hostname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hostname' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-60 font-mono text-sm'>
        {row.getValue('hostname')}
      </LongText>
    ),
  },
  {
    accessorKey: 'gatewayName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gateway' />
    ),
    cell: ({ row }) => (
      <Link
        to='/gateways/$gatewayId'
        params={{ gatewayId: row.original.gatewayId }}
        className='hover:underline'
      >
        <LongText className='max-w-40 font-medium text-primary'>
          {row.getValue('gatewayName')}
        </LongText>
      </Link>
    ),
    filterFn: (row, _id, value) => {
      return value.includes(row.original.gatewayId)
    },
  },
  {
    accessorKey: 'port',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Port' />
    ),
    cell: ({ row }) => (
      <div className='font-mono font-semibold'>{row.getValue('port')}</div>
    ),
    filterFn: (row, _id, value) => {
      const port = row.getValue('port') as number
      return value.includes(port.toString())
    },
  },
  {
    id: 'tlsEnabled',
    accessorFn: (row) => hasTLS(row),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TLS' />
    ),
    cell: ({ row }) => {
      const tlsEnabled = hasTLS(row.original)
      return (
        <div className='flex items-center gap-2'>
          {tlsEnabled ? (
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
      const tlsEnabled = hasTLS(row.original)
      return value.includes(tlsEnabled.toString())
    },
  },
  {
    accessorKey: 'apiCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='APIs' />
    ),
    cell: ({ row }) => (
      <div className='text-center tabular-nums'>{row.getValue('apiCount')}</div>
    ),
  },
  {
    accessorKey: 'policies',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Policies' />
    ),
    cell: ({ row }) => {
      const policies = row.getValue('policies') as string[]
      return (
        <div className='flex items-center gap-2'>
          {policies.length > 0 ? (
            <>
              <Shield className='h-4 w-4 text-blue-600 dark:text-blue-400' />
              <span className='text-sm tabular-nums'>{policies.length}</span>
            </>
          ) : (
            <span className='text-sm text-muted-foreground'>None</span>
          )}
        </div>
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
