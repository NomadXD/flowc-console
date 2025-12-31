import { useState } from 'react'
import { type API } from '@/data/mock/flowc-data'
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
import { toast } from 'sonner'

interface APIDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  api: API | null
  onDeleteSuccess?: () => void
}

export function APIDeleteDialog({
  open,
  onOpenChange,
  api,
  onDeleteSuccess,
}: APIDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!api) return

    setIsDeleting(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`API "${api.displayName}" deleted successfully`)
      onOpenChange(false)
      onDeleteSuccess?.()
    } catch (error) {
      toast.error('Failed to delete API')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!api) return null

  const hasDeployments = api.deployments.length > 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete API</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{api.displayName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasDeployments && (
          <div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
            <strong>Warning:</strong> This API has {api.deployments.length}{' '}
            active deployment{api.deployments.length > 1 ? 's' : ''}. Deleting
            this API will remove all deployments.
          </div>
        )}

        <div className='space-y-2 text-sm'>
          <div>
            <span className='text-muted-foreground'>Name:</span>{' '}
            <code className='rounded bg-muted px-1.5 py-0.5'>{api.name}</code>
          </div>
          <div>
            <span className='text-muted-foreground'>Version:</span>{' '}
            <span className='font-mono'>{api.version}</span>
          </div>
          <div>
            <span className='text-muted-foreground'>Context:</span>{' '}
            <code className='rounded bg-muted px-1.5 py-0.5'>{api.context}</code>
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
