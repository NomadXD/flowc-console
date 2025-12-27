import { useState } from 'react'
import { type Deployment, mockPolicies } from '@/data/mock/flowc-data'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DeploymentPolicyManagerProps {
  open: boolean
  onOpenChange: () => void
  deployment: Deployment
}

export function DeploymentPolicyManager({
  open,
  onOpenChange,
  deployment,
}: DeploymentPolicyManagerProps) {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>(
    deployment.enabledPolicies
  )
  const [isSaving, setIsSaving] = useState(false)

  // Get policies that are attached to the gateway or environment
  const availablePolicies = mockPolicies.filter(
    (policy) =>
      (policy.attachedTo === 'gateway' &&
        policy.attachedToId === deployment.gatewayId) ||
      (policy.attachedTo === 'environment' &&
        policy.attachedToName.includes(deployment.environment))
  )

  const handleTogglePolicy = (policyId: string) => {
    setSelectedPolicies((prev) =>
      prev.includes(policyId)
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId]
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Mock API call - replace with actual API call later
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Policies updated', {
        description: `Policy configuration for ${deployment.apiName} has been updated`,
      })
      onOpenChange()
    } catch (error) {
      toast.error('Failed to update policies', {
        description:
          error instanceof Error ? error.message : 'Please try again later',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Manage Policies</DialogTitle>
          <DialogDescription>
            Enable or disable mediation policies for {deployment.apiName}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Deployment Info */}
          <div className='rounded-lg border bg-muted/50 p-3'>
            <div className='flex items-center justify-between text-sm'>
              <div>
                <span className='font-medium'>{deployment.apiName}</span>
                <span className='text-muted-foreground'>
                  {' '}
                  ({deployment.version})
                </span>
              </div>
              <Badge variant='outline' className='font-mono text-xs'>
                {deployment.environment}
              </Badge>
            </div>
          </div>

          {/* Available Policies */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold'>Available Policies</h3>
              <span className='text-xs text-muted-foreground'>
                {selectedPolicies.length} of {availablePolicies.length} enabled
              </span>
            </div>

            {availablePolicies.length === 0 ? (
              <div className='rounded-lg border border-dashed p-8 text-center'>
                <p className='text-sm text-muted-foreground'>
                  No policies available for this deployment's gateway or
                  environment
                </p>
              </div>
            ) : (
              <ScrollArea className='h-[300px] rounded-md border p-4'>
                <div className='space-y-4'>
                  {availablePolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className='flex items-start space-x-3 rounded-lg border p-3 hover:bg-muted/50'
                    >
                      <Checkbox
                        id={policy.id}
                        checked={selectedPolicies.includes(policy.id)}
                        onCheckedChange={() => handleTogglePolicy(policy.id)}
                        disabled={!policy.enabled}
                        className='mt-1'
                      />
                      <div className='flex-1 space-y-1'>
                        <label
                          htmlFor={policy.id}
                          className='flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {policy.name}
                          <Badge variant='secondary' className='text-xs'>
                            {policy.type}
                          </Badge>
                          {!policy.enabled && (
                            <Badge
                              variant='outline'
                              className='border-amber-300 bg-amber-100/30 text-amber-900 dark:text-amber-200'
                            >
                              Disabled
                            </Badge>
                          )}
                        </label>
                        <p className='text-xs text-muted-foreground'>
                          {policy.description}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Attached to:{' '}
                          <span className='font-medium'>
                            {policy.attachedToName}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onOpenChange} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
