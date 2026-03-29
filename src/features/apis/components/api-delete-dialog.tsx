import type { APIResponse } from '@/lib/api/openapi/types'
import { useDeleteApi } from '@/hooks/use-apis'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface APIDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  api: APIResponse | null
  onDeleteSuccess?: () => void
}

export function APIDeleteDialog({
  open,
  onOpenChange,
  api,
  onDeleteSuccess,
}: APIDeleteDialogProps) {
  const { mutate: deleteApi, isPending: isDeleting } = useDeleteApi()

  const handleDelete = () => {
    if (!api) return

    deleteApi(
      {
        name: api.metadata.name,
        ifMatch: api.metadata.revision,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onDeleteSuccess?.()
        },
      }
    )
  }

  if (!api) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete API</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <strong>{api.spec.displayName || api.metadata.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-2 text-sm'>
          <div>
            <span className='text-muted-foreground'>Name:</span>{' '}
            <code className='rounded bg-muted px-1.5 py-0.5'>
              {api.metadata.name}
            </code>
          </div>
          <div>
            <span className='text-muted-foreground'>Version:</span>{' '}
            <span className='font-mono'>{api.spec.version}</span>
          </div>
          <div>
            <span className='text-muted-foreground'>Context:</span>{' '}
            <code className='rounded bg-muted px-1.5 py-0.5'>
              {api.spec.context}
            </code>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className='bg-destructive hover:bg-destructive/90'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
