import { formatDistanceToNow } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import type { APIResponse } from '@/lib/api/openapi/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { API_STATUS_STYLES } from '../data/constants'
import { DataTableRowActions } from './data-table-row-actions'

export const apisColumns: ColumnDef<APIResponse>[] = [
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
    id: 'displayName',
    accessorFn: (row) => row.spec.displayName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='API Name' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col gap-0.5'>
        <LongText className='max-w-48 font-medium'>
          {row.original.spec.displayName || row.original.metadata.name}
        </LongText>
        <span className='text-xs text-muted-foreground'>
          {row.original.metadata.name}
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
    id: 'version',
    accessorFn: (row) => row.spec.version,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Version' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs text-muted-foreground'>
        {row.original.spec.version}
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
      const style = API_STATUS_STYLES[phase] || { variant: 'outline' as const }

      return (
        <Badge variant={style.variant} className={style.className}>
          {phase.charAt(0).toUpperCase() + phase.slice(1)}
        </Badge>
      )
    },
  },
  {
    id: 'context',
    accessorFn: (row) => row.spec.context,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Context Path' />
    ),
    cell: ({ row }) => (
      <code className='rounded bg-muted px-1.5 py-0.5 text-xs font-mono'>
        {row.original.spec.context}
      </code>
    ),
  },
  {
    id: 'policyChain',
    accessorFn: (row) => row.spec.policyChain?.length ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Policies' />
    ),
    cell: ({ row }) => {
      const policies = (row.original.spec.policyChain || []).filter(
        (p) => p.enabled
      )
      return (
        <div className='flex items-center gap-1'>
          <span className='text-sm font-medium'>{policies.length}</span>
          <span className='text-xs text-muted-foreground'>enabled</span>
        </div>
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
    cell: ({ row }) => <DataTableRowActions row={row} onDelete={() => {}} />,
    meta: {
      className: cn('max-md:sticky end-0 z-10 rounded-tr-[inherit]'),
    },
  },
]
