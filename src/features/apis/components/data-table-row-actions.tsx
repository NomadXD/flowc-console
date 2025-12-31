import { type Row } from '@tanstack/react-table'
import { type API } from '@/data/mock/flowc-data'
import { MoreHorizontal, Trash2, Eye, Edit, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'

interface DataTableRowActionsProps {
  row: Row<API>
  onDelete: (api: API) => void
}

export function DataTableRowActions({ row, onDelete }: DataTableRowActionsProps) {
  const api = row.original
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate({ to: `/apis/$apiId`, params: { apiId: api.id } })
  }

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
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className='me-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Edit className='me-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Rocket className='me-2 h-4 w-4' />
          Deploy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(api)}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='me-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
