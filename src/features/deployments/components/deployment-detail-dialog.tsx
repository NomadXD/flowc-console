import { format } from 'date-fns'
import { type Deployment } from '@/data/mock/flowc-data'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deploymentStatusStyles } from '../data/constants'

interface DeploymentDetailDialogProps {
  open: boolean
  onOpenChange: () => void
  deployment: Deployment
}

export function DeploymentDetailDialog({
  open,
  onOpenChange,
  deployment,
}: DeploymentDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Deployment Details</DialogTitle>
          <DialogDescription>
            View detailed information about this deployment
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* API Information */}
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold'>API Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-xs text-muted-foreground'>API Name</div>
                <div className='mt-1 font-medium'>{deployment.apiName}</div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Version</div>
                <div className='mt-1 font-mono text-sm'>
                  {deployment.version}
                </div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>
                  Specification File
                </div>
                <div className='mt-1 font-mono text-sm'>
                  {deployment.specFile}
                </div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Status</div>
                <div className='mt-1'>
                  <Badge
                    variant='outline'
                    className={cn(
                      'capitalize',
                      deploymentStatusStyles.get(deployment.status)
                    )}
                  >
                    {deployment.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Target Information */}
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold'>Target Environment</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-xs text-muted-foreground'>Gateway</div>
                <div className='mt-1'>{deployment.gatewayName}</div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Port</div>
                <div className='mt-1 font-mono'>{deployment.port}</div>
              </div>
              <div className='col-span-2'>
                <div className='text-xs text-muted-foreground'>Environment</div>
                <div className='mt-1'>
                  <Badge variant='outline' className='font-mono'>
                    {deployment.environment}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Metadata */}
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold'>Deployment Metadata</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-xs text-muted-foreground'>Deployed At</div>
                <div className='mt-1 text-sm'>
                  {format(new Date(deployment.deployedAt), 'PPpp')}
                </div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Deployed By</div>
                <div className='mt-1 text-sm'>{deployment.deployedBy}</div>
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>
                  Deployment ID
                </div>
                <div className='mt-1 font-mono text-xs'>{deployment.id}</div>
              </div>
            </div>
          </div>

          {/* Enabled Policies */}
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold'>Enabled Policies</h3>
            {deployment.enabledPolicies.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {deployment.enabledPolicies.map((policyId) => (
                  <Badge key={policyId} variant='secondary'>
                    {policyId}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                No policies enabled for this deployment
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
