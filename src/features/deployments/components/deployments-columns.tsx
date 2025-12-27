import { formatDistanceToNow } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type Deployment } from '@/data/mock/flowc-data'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { deploymentStatusStyles } from '../data/constants'
import { DataTableRowActions } from './data-table-row-actions'

export const deploymentsColumns: ColumnDef<Deployment>[] = [
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
    accessorKey: 'apiName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='API Name' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col gap-0.5'>
        <LongText className='max-w-48 font-medium'>
          {row.getValue('apiName')}
        </LongText>
        <span className='text-xs text-muted-foreground'>
          {row.original.version}
        </span>
      </div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'gatewayName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gateway' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32 text-muted-foreground'>
        {row.getValue('gatewayName')}
      </LongText>
    ),
  },
  {
    accessorKey: 'port',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Port' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.getValue('port')}</span>
    ),
  },
  {
    accessorKey: 'environment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Environment' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='font-mono text-xs'>
        {row.getValue('environment')}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as Deployment['status']
      return (
        <Badge
          variant='outline'
          className={cn('capitalize', deploymentStatusStyles.get(status))}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'deployedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Deployed' />
    ),
    cell: ({ row }) => {
      const deployedAt = row.getValue('deployedAt') as string
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-sm'>
            {formatDistanceToNow(new Date(deployedAt), { addSuffix: true })}
          </span>
          <span className='text-xs text-muted-foreground'>
            by {row.original.deployedBy}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'w-12',
    },
  },
]
