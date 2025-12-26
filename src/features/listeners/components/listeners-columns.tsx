import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { type Listener } from '@/data/mock/flowc-data'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { protocolStyles } from '../data/constants'
import { DataTableRowActions } from './data-table-row-actions'

export const listenersColumns: ColumnDef<Listener>[] = [
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
    accessorKey: 'port',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Port' />
    ),
    cell: ({ row }) => (
      <div className='ps-3 font-mono font-semibold'>{row.getValue('port')}</div>
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
    accessorKey: 'protocol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Protocol' />
    ),
    cell: ({ row }) => {
      const protocol = row.getValue('protocol') as Listener['protocol']
      const style = protocolStyles[protocol]
      return <Badge variant={style.variant}>{style.label}</Badge>
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.getValue('protocol'))
    },
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
    accessorKey: 'tlsEnabled',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TLS' />
    ),
    cell: ({ row }) => {
      const tlsEnabled = row.getValue('tlsEnabled') as boolean
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
      const tlsEnabled = row.getValue('tlsEnabled') as boolean
      return value.includes(tlsEnabled.toString())
    },
  },
  {
    accessorKey: 'environmentCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Environments' />
    ),
    cell: ({ row }) => (
      <div className='text-center tabular-nums'>
        {row.getValue('environmentCount')}
      </div>
    ),
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
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn('max-md:sticky end-0 rounded-tr-[inherit]'),
    },
  },
]
