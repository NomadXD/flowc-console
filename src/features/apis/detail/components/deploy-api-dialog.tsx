import type { APIResponse } from '@/lib/api/openapi/types'
import { useGateways } from '@/hooks/use-gateways'
import { useListeners } from '@/hooks/use-listeners'
import { useVirtualHosts } from '@/hooks/use-virtual-hosts'
import { usePutDeployment } from '@/hooks/use-deployments'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Rocket } from 'lucide-react'
import { useState } from 'react'

interface DeployAPIDialogProps {
  api: APIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeployAPIDialog({
  api,
  open,
  onOpenChange,
}: DeployAPIDialogProps) {
  const [selectedGateway, setSelectedGateway] = useState<string>('')
  const [selectedListener, setSelectedListener] = useState<string>('')
  const [selectedVirtualHost, setSelectedVirtualHost] = useState<string>('')

  const { data: gatewaysData } = useGateways()
  const { data: listenersData } = useListeners(
    selectedGateway ? { gatewayRef: selectedGateway } : undefined
  )
  const { data: virtualHostsData } = useVirtualHosts(
    selectedGateway
      ? { gatewayRef: selectedGateway, listenerRef: selectedListener || undefined }
      : undefined
  )
  const { mutate: putDeployment, isPending: isDeploying } = usePutDeployment()

  const gateways = gatewaysData?.items || []
  const listeners = listenersData?.items || []
  const virtualHosts = virtualHostsData?.items || []

  const handleDeploy = () => {
    const deploymentName = `${api.metadata.name}-${selectedVirtualHost || selectedGateway}`

    putDeployment(
      {
        name: deploymentName,
        body: {
          spec: {
            apiRef: api.metadata.name,
            gateway: {
              name: selectedGateway,
              listener: selectedListener || undefined,
              virtualHost: selectedVirtualHost || undefined,
            },
          },
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setSelectedGateway('')
          setSelectedListener('')
          setSelectedVirtualHost('')
        },
      }
    )
  }

  const canDeploy = selectedGateway && !isDeploying

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Rocket className='h-5 w-5' />
            Deploy API: {api.spec.displayName || api.metadata.name}
          </DialogTitle>
          <DialogDescription>
            Select the target gateway and virtual host to deploy this API.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <Card>
            <CardHeader>
              <CardTitle>Deployment Target</CardTitle>
              <CardDescription>
                Choose where to deploy this API
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4'>
                {/* Gateway Selection */}
                <div className='space-y-2'>
                  <Label htmlFor='gateway'>Gateway</Label>
                  <Select
                    value={selectedGateway}
                    onValueChange={(value) => {
                      setSelectedGateway(value)
                      setSelectedListener('')
                      setSelectedVirtualHost('')
                    }}
                  >
                    <SelectTrigger id='gateway'>
                      <SelectValue placeholder='Select a gateway' />
                    </SelectTrigger>
                    <SelectContent>
                      {gateways.map((gateway) => (
                        <SelectItem
                          key={gateway.metadata.name}
                          value={gateway.metadata.name}
                        >
                          {gateway.metadata.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Listener Selection */}
                <div className='space-y-2'>
                  <Label htmlFor='listener'>Listener (optional)</Label>
                  <Select
                    value={selectedListener}
                    onValueChange={(value) => {
                      setSelectedListener(value)
                      setSelectedVirtualHost('')
                    }}
                    disabled={!selectedGateway}
                  >
                    <SelectTrigger id='listener'>
                      <SelectValue placeholder='Select a listener' />
                    </SelectTrigger>
                    <SelectContent>
                      {listeners.map((listener) => (
                        <SelectItem
                          key={listener.metadata.name}
                          value={listener.metadata.name}
                        >
                          {listener.metadata.name} (port{' '}
                          {listener.spec.port})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Virtual Host Selection */}
                <div className='space-y-2'>
                  <Label htmlFor='virtualHost'>Virtual Host (optional)</Label>
                  <Select
                    value={selectedVirtualHost}
                    onValueChange={setSelectedVirtualHost}
                    disabled={!selectedGateway}
                  >
                    <SelectTrigger id='virtualHost'>
                      <SelectValue placeholder='Select a virtual host' />
                    </SelectTrigger>
                    <SelectContent>
                      {virtualHosts.map((vhost) => (
                        <SelectItem
                          key={vhost.metadata.name}
                          value={vhost.metadata.name}
                        >
                          {vhost.metadata.name} ({vhost.spec.hostname})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deployment Summary */}
          {canDeploy && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>API</dt>
                    <dd className='font-medium'>
                      {api.spec.displayName || api.metadata.name}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Version</dt>
                    <dd className='font-medium'>{api.spec.version}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Gateway</dt>
                    <dd className='font-medium'>{selectedGateway}</dd>
                  </div>
                  {selectedListener && (
                    <div>
                      <dt className='text-muted-foreground'>Listener</dt>
                      <dd className='font-medium'>{selectedListener}</dd>
                    </div>
                  )}
                  {selectedVirtualHost && (
                    <div>
                      <dt className='text-muted-foreground'>Virtual Host</dt>
                      <dd className='font-medium'>{selectedVirtualHost}</dd>
                    </div>
                  )}
                  <div>
                    <dt className='text-muted-foreground'>Context Path</dt>
                    <dd className='font-medium font-mono'>
                      {api.spec.context}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeploy} disabled={!canDeploy}>
            <Rocket className='mr-2 h-4 w-4' />
            {isDeploying ? 'Deploying...' : 'Deploy API'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
