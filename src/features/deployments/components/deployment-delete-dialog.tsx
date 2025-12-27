import { useState } from 'react'
import { type Deployment } from '@/data/mock/flowc-data'
import { toast } from 'sonner'
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

interface DeploymentDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  deployment: Deployment
}

export function DeploymentDeleteDialog({
  open,
  onOpenChange,
  deployment,
}: DeploymentDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Mock API call - replace with actual API call later
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Deployment deleted', {
        description: `${deployment.apiName} (${deployment.version}) has been removed from ${deployment.environment}`,
      })
      onOpenChange()
    } catch (error) {
      toast.error('Failed to delete deployment', {
        description:
          error instanceof Error ? error.message : 'Please try again later',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Deployment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this deployment? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='my-4 rounded-lg border bg-muted/50 p-4'>
          <div className='space-y-2 text-sm'>
            <div>
              <span className='font-medium'>API:</span> {deployment.apiName}{' '}
              <span className='text-muted-foreground'>
                ({deployment.version})
              </span>
            </div>
            <div>
              <span className='font-medium'>Environment:</span>{' '}
              {deployment.environment}
            </div>
            <div>
              <span className='font-medium'>Gateway:</span>{' '}
              {deployment.gatewayName}:{deployment.port}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
          >
            {isDeleting ? 'Deleting...' : 'Delete Deployment'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
