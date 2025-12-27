import { type Row } from '@tanstack/react-table'
import { type Deployment } from '@/data/mock/flowc-data'
import { MoreHorizontal, Eye, Shield, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeploymentsDialog } from './deployments-provider'

interface DataTableRowActionsProps {
  row: Row<Deployment>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const deployment = row.original
  const { setDetailDialog, setPolicyDialog, setDeleteDialog } =
    useDeploymentsDialog()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => setDetailDialog(deployment)}>
          <Eye className='me-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPolicyDialog(deployment)}>
          <Shield className='me-2 h-4 w-4' />
          Manage Policies
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeleteDialog(deployment)}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='me-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
